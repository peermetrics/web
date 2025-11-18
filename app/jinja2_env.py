import json

from django.utils.http import urlencode
from django.conf import settings
from django.contrib.staticfiles.storage import staticfiles_storage
from django.contrib.messages import get_messages
from django.urls import reverse
from jinja2 import Environment

def custom_reverse(url, *args, **kwargs):
    """
    just a wrapper over django's reverse
    in the templates just past kwargs normally, as in webapp2

    query is a special kwarg used to add GET parameters

    not accepting other args as of now
    """

    query = kwargs.pop('query', {})
    url = reverse(url, kwargs=kwargs)

    if query:
        # filter out falsey values
        to_encode = {q: query[q] for q in query.keys() if query[q]}
        url += '?' + urlencode(to_encode)

    return url


def environment(**options):
    env = Environment(**options)
    env.globals.update({
        "title": 'peer metrics',
        "DEV": settings.DEV,
        "template_vars": settings.TEMPLATE_VARS,
        'url': custom_reverse,
        'static': staticfiles_storage.url,
        'get_messages': get_messages
    })
    env.filters['to_json'] = json.dumps
    env.filters['from_json'] = json.loads

    return env
