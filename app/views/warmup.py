import importlib

from django.conf import settings
from django.http import HttpResponse
from django.views import View
from django.contrib.auth.models import Group


class WarmupView(View):
    """
    Provides default procedure for handling warmup requests on AppEngine.
    """

    @classmethod
    def get(cls, request):
        # import all the modules
        for app in settings.INSTALLED_APPS:
            for name in ('urls', 'views', 'models'):
                try:
                    importlib.import_module('{}.{}'.format(app, name))
                except ImportError:
                    pass

        # initialize the connection to the db
        Group.objects.all().exists()

        # respond with something
        content_type = 'text/plain; charset={}'.format(settings.DEFAULT_CHARSET)
        return HttpResponse('Warmup done.', content_type=content_type)
