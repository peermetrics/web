import datetime
import uuid

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import JSONField
from django.db import models

from .basemodel import BaseModel


class User(AbstractUser, BaseModel):
    """
    User model.

    Fields:
        id: ID from db, UUID
        last_active: the last time the user was active, date
        billing: billing information, dict
        notifications: notifications, dict
        is_verified: True if the user verified the provided email, bool
        max_usage: max number of seconds the user allows recorded, int
        usage: number of seconds the user recorded, int
    """

    class Meta:
        app_label = 'app'
        db_table = 'users'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    last_active = models.DateField(default=datetime.datetime.utcnow, null=True, blank=True)
    billing = JSONField(null=True, blank=True, default=dict)
    notifications = JSONField(null=True, blank=True, default=dict)
    is_verified = models.BooleanField(default=False)
    max_usage = models.PositiveIntegerField(
        null=False, blank=True, default=settings.PLANS[settings.FREE_PLAN_ID]['max_usage'],
    )
    usage = models.PositiveIntegerField(null=False, blank=True, default=0)
    created_at = models.DateTimeField(default=datetime.datetime.utcnow)

    def update_last_active(self):
        """
        Updates the last_active field if the user used the website during a new day.
        """
        if self.last_active != datetime.datetime.utcnow().date():
            self.last_active = datetime.datetime.utcnow().date()
            self.save()

    @staticmethod
    def get_type():
        return 'user'

    def __str__(self):
        return self.username
