from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden, HttpResponseRedirect
from django.shortcuts import render, reverse
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.generic import View

from ..models.conference import Conference

@method_decorator(login_required, name='dispatch')
class ConferenceView(View):
    template_name = 'account/conference.html'

    @classmethod
    def get(cls, request, conference_id, *args, **kwargs):
        try:
            conference = Conference.get(id=conference_id)
        except Conference.DoesNotExist:
            return HttpResponseRedirect(reverse('dashboard'))

        data_retention_days = 30

        app = conference.app
        organization = app.organization

        if request.user.organization != organization:
            return HttpResponseForbidden('You do not have permission to access this conference.')

        context = {
            'breadcrumbs': [{
                'url': reverse('organization', kwargs={'organization_id': organization.id}),
                'text': organization.name,
            }, {
                'url': reverse('app', kwargs={'app_id': app.id}),
                'text': app.name
            }, {
                'text': conference.conference_name or conference.conference_id
            }],
            'conference': conference,
            'data_retention_days': data_retention_days,
            'participants': conference.participants.filter(is_active=True)
        }

        return render(request, cls.template_name, context=context)
