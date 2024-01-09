from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.views.generic import View

from ..models.organization import Organization

class WelcomePage(View):
    """
    View used with newly created accounts.
    After the user has verified the email address we show this page which is a short onboarding process
    """

    template_name = 'welcome.html'

    def get(self, request, *args, **kwargs):
        """

        :param request:
        :param args:
        :param kwargs:
        :return:
        """

        if Organization.objects.count() > 0:
            return HttpResponseRedirect(reverse('dashboard'))

        # if user has at least one org registered, redirect to dashboard, no need for this view

        # on this view
        # create the org (or if created, rename it)
        # code snippet for the api integration (we need the apiKey)

        return render(request, self.template_name)
