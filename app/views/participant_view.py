from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden, HttpResponseRedirect
from django.shortcuts import render, reverse
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.generic import View

from ..models.participant import Participant

@method_decorator(login_required, name='dispatch')
class ParticipantView(View):
    template_name = 'account/participant.html'

    @classmethod
    def get(cls, request, participant_id, *args, **kwargs):
        try:
            participant = Participant.get(id=participant_id)
        except Participant.DoesNotExist:
            return HttpResponseRedirect(reverse('dashboard'))

        data_retention_days = 30

        organization = participant.conference.app.organization
        if request.user.organization != organization:
            return HttpResponseForbidden('You do not have permission to access this participant.')

        context = {
            'data_retention_days': data_retention_days,
            'participant': participant
        }

        return render(request, cls.template_name, context=context)
