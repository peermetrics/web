from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

from app.views.warmup import WarmupView

prefix = settings.URL_PREFIX.strip('/') if getattr(settings, 'URL_PREFIX', '') else ''

if prefix:
    urlpatterns = [
        path(f'{prefix}/admin/', admin.site.urls),
        path(f'{prefix}/_ah/warmup/', WarmupView.as_view(), name='warmup'),
        path(f'{prefix}/', include('app.urls')),
    ]
else:
    urlpatterns = [
        path('admin/', admin.site.urls),
        path('_ah/warmup/', WarmupView.as_view(), name='warmup'),
        path('', include('app.urls')),
    ]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Custom error handlers
handler404 = 'app.errors.handler404'
handler403 = 'app.errors.handler403'
handler500 = 'app.errors.handler500'
