from django.http import HttpResponseRedirect
from django.shortcuts import render, reverse
from django.views.generic import View

from ..models.app import App

class AppView(View):
    """
    The main view for an account.
    This offers an overview of the stats for this app
    """
    template_name = 'account/app-dashboard.html'

    @classmethod
    def get(cls, request, app_id, *args, **kwargs):

        app = App.objects.filter(id=app_id).first()

        if not app:
            return HttpResponseRedirect(reverse('dashboard'))

        organization = app.organization

        context = {
            'breadcrumbs': [{
                'url': reverse('organization', kwargs={'organization_id': organization.id}),
                'text': organization.name,
            }, {
                'text': app.name
            }],
            'data_retention_days': 30,
            'app': app,
        }

        return render(request, cls.template_name, context=context)
