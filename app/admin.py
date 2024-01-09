from django.contrib import admin

from .models.app import App
from .models.conference import Conference
from .models.generic_event import GenericEvent
from .models.organization import Organization
from .models.participant import Participant
from .models.session import Session

admin.site.register(Conference)
admin.site.register(GenericEvent)
admin.site.register(Participant)
admin.site.register(Session)

admin.site.register(App)
admin.site.register(Organization)
