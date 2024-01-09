from django.http import HttpResponseRedirect
from django.shortcuts import render, reverse
from django.conf import settings
from django.views.generic import View

from ..models.participant import Participant

class ParticipantView(View):
    template_name = 'account/participant.html'

    @classmethod
    def get(cls, request, participant_id, *args, **kwargs):
        try:
            participant = Participant.get(id=participant_id)
        except Participant.DoesNotExist:
            return HttpResponseRedirect(reverse('dashboard'))

        data_retention_days = 30

        context = {
            'data_retention_days': data_retention_days,
            'participant': participant
        }

        return render(request, cls.template_name, context=context)
