from django.conf import settings
from django.contrib import messages
from django.contrib.auth import (
    authenticate,
    login as auth_login,
    logout as auth_logout,
    update_session_auth_hash,
)
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views.decorators.cache import never_cache
from django.views.decorators.http import require_http_methods
from django_ratelimit.decorators import ratelimit


@never_cache
@ratelimit(key='ip', rate='5/5m', method='POST', block=False)
@require_http_methods(["GET", "POST"])
def login_view(request):
    """
    Login view with support for detecting default admin password.
    Rate limited to 5 attempts per 5 minutes per IP address.
    """
    if request.user.is_authenticated:
        return redirect("dashboard")

    # Check if rate limited
    if getattr(request, 'limited', False):
        messages.error(
            request,
            "Too many login attempts. Please try again in a few minutes."
        )
        return render(request, "login.html")

    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            auth_login(request, user)

            if password == settings.DEFAULT_ADMIN_PASSWORD:
                return redirect(reverse("change_password") + "?prompt=true")

            next_url = request.GET.get("next", "dashboard")
            return redirect(next_url)

        messages.error(request, "Invalid username or password.")

    return render(request, "login.html")


@login_required
def logout_view(request):
    """
    Logout view.
    """
    auth_logout(request)
    messages.success(request, "You have been logged out successfully.")
    return redirect("login")


@never_cache
@login_required
@require_http_methods(["GET", "POST"])
def change_password_view(request):
    """
    Change password view with optional skip
    Shows warning if accessed with ?prompt=true (default password detected).
    """
    show_prompt = request.GET.get("prompt") == "true"
    show_skip = show_prompt

    if request.method == "POST":
        action = request.POST.get("action")

        if action == "skip":
            messages.info(
                request,
                "You are still using the default password. "
                "You will be prompted to change it on your next login.",
            )
            return redirect("dashboard")

        new_password = request.POST.get("new_password")
        confirm_password = request.POST.get("confirm_password")

        if not new_password or not confirm_password:
            messages.error(request, "Please fill in both password fields.")
        elif new_password != confirm_password:
            messages.error(request, "Passwords do not match.")
        elif len(new_password) < 8:
            messages.error(request, "Password must be at least 8 characters long.")
        else:
            request.user.set_password(new_password)
            request.user.save()
            update_session_auth_hash(request, request.user)
            messages.success(request, "Password changed successfully!")
            return redirect("dashboard")

    context = {
        "show_prompt": show_prompt,
        "show_skip": show_skip,
    }

    return render(request, "change_password.html", context)
