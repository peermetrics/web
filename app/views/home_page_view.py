
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

from app.models.organization import Organization

from django.views.generic import View

@method_decorator(login_required, name='dispatch')
class HomePageView(View):

    def get(self, request, *args, **kwargs):

        if request.user.organization:
            return HttpResponseRedirect(reverse('dashboard'))

        return HttpResponseRedirect(reverse('welcome'))
