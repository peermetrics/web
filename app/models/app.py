import datetime
import uuid

import validators
from django.conf import settings
from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.postgres.fields import JSONField

from .basemodel import BaseModel
from .organization import Organization

def validate_domain(domain):
    if not validators.domain(domain):
        raise ValidationError('Domain ({}) is not valid'.format(domain))


class App(BaseModel):
    """
    An abstraction of an app thar's being monitored by PeerMetrics.

    Attrs:
        cache_keys: combinations of fields used to compose the keys used to cache the object

    Fields:
        id: ID from db, UUID
        name: name for this app, set by user, string
        api_key: the key used by the app, string
        domain: the domain from which we should accept metrics, can be null, but it's recommended not to be, string
        organization: the organization that owns this app, an app will belong to one organization only, fk
        interval: how often should we collect info, seconds: 5, 10, 30, 60, int
        recording: whether the app is recording or not, bool
        durations_days: cache containing the durations of all the calls for the last data_retention days, dict
    """

    class Meta:
        db_table = 'app'

    cache_keys = (
        sorted(('id',)),
        sorted(('api_key',)),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(null=False, max_length=64, verbose_name="name for this app")
    api_key = models.CharField(unique=True, null=False, max_length=32)
    domain = models.CharField(max_length=256, null=True, blank=True, validators=[validate_domain])
    organization = models.ForeignKey(
        Organization,
        null=False,
        on_delete=models.CASCADE,
        verbose_name="the organization that owns this app", related_name='apps',
    )
    interval = models.IntegerField(default=settings.DEFAULT_INTERVAL)
    recording = models.BooleanField(default=True)
    durations_days = JSONField(null=True, blank=True, default=dict)
    created_at = models.DateTimeField(default=datetime.datetime.utcnow)
    is_active = models.BooleanField(default=True)

    def update_duration_days(self):
        """
        Method used to change the data stored in app.duration_days so that it does not contain data about days older
        than the time allowed by the owner's plan.
        """

        today = datetime.datetime.utcnow().date()
        retention_days = 30

        days = [today - datetime.timedelta(days=i) for i in range(retention_days)]
        new_cache = {str(day): self.durations_days.get(str(day), 0) for day in days}

        self.durations_days = new_cache

    def prepare(self):
        self.update_duration_days()
        self.save()

    @property
    def owner(self):
        return self.organization.owner

    @staticmethod
    def get_type():
        return 'app'

    def get_absolute_url(self):
        return ''.join([
            '/apps/',
            str(self.id),
        ])

    def get_name(self):
        return self.name

    def __str__(self):
        return str(self.id)
