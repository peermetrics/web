from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views.generic import View

from ..models.organization import Organization

@method_decorator(login_required, name='dispatch')
class DashboardView(View):
    template_name = 'account/dashboard.html'

    @classmethod
    def get(cls, request, *args, **kwargs):
        user_organization = request.user.organization

        if not user_organization:
            return HttpResponseRedirect(reverse('welcome'))

        organizations = Organization.objects.filter(id=user_organization.id)

        if not organizations:
            return HttpResponseRedirect(reverse('welcome'))

        context = {
            'organizations': organizations,
        }

        return render(request, cls.template_name, context=context)
