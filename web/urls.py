from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

from app.views.warmup import WarmupView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('_ah/warmup/', WarmupView.as_view(), name='warmup'),
    path('', include('app.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Custom error handlers
handler404 = 'app.errors.handler404'
handler403 = 'app.errors.handler403'
handler500 = 'app.errors.handler500'
