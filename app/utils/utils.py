import json

from django.http import HttpResponse

class JSONHttpResponse(HttpResponse):
    """
    An HttpResponse wrapper used to format the response in JSON format. The default response type.
    """
    def __init__(self, content='', *args, **kwargs):
        super().__init__(content=json.dumps(content), *args, **kwargs)
