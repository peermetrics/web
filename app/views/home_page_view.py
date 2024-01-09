
from django.urls import reverse
from django.http import HttpResponseRedirect

from app.models.organization import Organization

from django.views.generic import View

class HomePageView(View):

    def get(self, request, *args, **kwargs):

        if Organization.objects.count() > 0:
            return HttpResponseRedirect(reverse('dashboard'))

        return HttpResponseRedirect(reverse('welcome'))
