from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.views.generic import View

from ..models.organization import Organization

class DashboardView(View):
    template_name = 'account/dashboard.html'

    @classmethod
    def get(cls, request, *args, **kwargs):

        # get all organizations
        organizations = Organization.objects.all()

        if not organizations:
            return HttpResponseRedirect(reverse('welcome'))

        context = {
            'organizations': organizations,
        }

        return render(request, cls.template_name, context=context)
