import datetime
import uuid

from django.conf import settings
from django.contrib.postgres.fields import JSONField
from django.db import models

from .app import App
from .basemodel import BaseModel


class GenericEvent(BaseModel):
    """
    A model for all user events

    Fields:
        id: ID from db, UUID
        conference: the conference linked to the event
        participant: the participant linked to the event
        peer: the other participant linked to the event
        session: the session linked to the event
        app: the app linked to the event
        type: the event type, received in request
        category: the event category, set based on the route it is received on
        data: the data of the event
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    conference = models.ForeignKey('Conference', on_delete=models.CASCADE, null=False, related_name='events')
    participant = models.ForeignKey('Participant', on_delete=models.CASCADE, null=False, related_name='events')
    peer = models.ForeignKey(
        'Participant', on_delete=models.CASCADE, null=True, blank=True, related_name='events_where_peer',
    )
    session = models.ForeignKey('Session', on_delete=models.CASCADE, null=False, related_name='events')
    connection = models.ForeignKey('Connection', on_delete=models.CASCADE, null=True, blank=True, related_name='events')
    track = models.ForeignKey('Track', on_delete=models.CASCADE, null=True, blank=True, related_name='events')
    app = models.ForeignKey(App, on_delete=models.CASCADE, null=False, related_name='events')
    type = models.CharField(null=False, max_length=32)
    category = models.CharField(
        max_length=1,
        choices=tuple([(settings.EVENT_CATEGORIES[key], key) for key in settings.EVENT_CATEGORIES.keys()]),
    )
    data = JSONField(null=True, blank=True, default=dict)
    created_at = models.DateTimeField(default=datetime.datetime.utcnow)
    is_active = models.BooleanField(default=True)

    @staticmethod
    def get_type():
        return 'generic_event'

    def __str__(self):
        return str(self.id)
