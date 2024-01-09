from django.conf import settings
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.views.generic import View

from ..models.app import App
from ..models.organization import Organization

class OrganizationView(View):
    template_name = 'account/organization.html'

    @classmethod
    def get(cls, request, organization_id, *args, **kwargs):

        try:
            organization = Organization.objects.get(id=organization_id)
        except Organization.DoesNotExist:
            return HttpResponseRedirect(reverse('dashboard'))

        if not organization:
            return HttpResponseRedirect(reverse('dashboard'))

        apps = App.filter(organization=organization)

        context = {
            'breadcrumbs': [{
                'url': reverse('organization', kwargs={'organization_id': organization_id}),
                'text': organization.name,
            }],
            'organization': organization,
            'apps': apps,
        }

        return render(request, cls.template_name, context=context)
