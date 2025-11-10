from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.views.generic import View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

from ..models.organization import Organization

@method_decorator(login_required, name='dispatch')
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

        if request.user.organization:
            return HttpResponseRedirect(reverse('dashboard'))

        # if user has an organization registered, redirect to dashboard, no need for this view

        # on this view
        # create the org (or if created, rename it)
        # code snippet for the api integration (we need the apiKey)

        return render(request, self.template_name)
