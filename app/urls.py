
from django.contrib.auth import views as auth_views
from django.shortcuts import redirect
from django.urls import path

from .views.home_page_view import HomePageView
from .views.welcome_page_view import WelcomePage
from .views.app_view import AppView
from .views.conference_view import ConferenceView
from .views.dashboard_view import DashboardView
from .views.organization_view import OrganizationView
from .views.participant_view import ParticipantView

urlpatterns = [
    path('', HomePageView.as_view(), name='home'),

    path('welcome', WelcomePage.as_view(), name='welcome'),

    path('dashboard', DashboardView.as_view(), name='dashboard'),

    path('organization/<uuid:organization_id>', OrganizationView.as_view(), name='organization'),

    path('apps/<uuid:app_id>', AppView.as_view(), name='app'),

    path('conference/<uuid:conference_id>', ConferenceView.as_view(), name='conference'),
    path('participant/<uuid:participant_id>', ParticipantView.as_view(), name='participant'),

    path('docs', lambda request: redirect('https://github.com/peermetrics/sdk-js'), name='docs'),
]
