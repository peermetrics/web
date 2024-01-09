from django.urls import reverse

from ..models.user import User
from .classes import PMTestCase


class SignInViewTestCase(PMTestCase):

    def test_post_redirect_verify(self):

        s = 'a92@a.com'
        user_password = 'password'
        user = User(
            username=s,
            email=s,
            billing={},
            notifications={},
            is_verified=False,
        )
        user.set_password(user_password)
        user.save()

        response = self.client.post(
            path='/sign-in',
            data={
                'email': user.email,
                'password': user_password,
                'box-1': 'box-1',
            },
        )

        self.assertRedirects(response, reverse('verify-account'))
        self.assertTrue('sessionid' in str(response.cookies))
        self.assertTrue('csrftoken' in str(response.cookies))

    def test_post_redirect_dashboard(self):
        response = self.client.post(
            path='/sign-in',
            data={
                'email': self.user.email,
                'password': self.user_password,
                'box-1': 'box-1',
            },
        )

        self.assertRedirects(response, reverse('dashboard'))
        self.assertTrue('sessionid' in str(response.cookies))
        self.assertTrue('csrftoken' in str(response.cookies))

    def test_post_redirect_sign_in(self):

        s = 'a92@a.com'
        user_password = 'password'
        user = User(
            username=s,
            email=s,
            billing={},
            notifications={},
            is_verified=True,
            is_active=False,
        )
        user.set_password(user_password)
        user.save()

        response = self.client.post(
            path='/sign-in',
            data={
                'email': user.email,
                'password': user_password,
                'box-1': 'box-1',
            },
        )

        self.assertRedirects(response, reverse('sign-in'))

    def test_post_redirect_invalid_login(self):

        s = 'a92@a.com'
        user_password = 'password'
        user = User(
            username=s,
            email=s,
            billing={},
            notifications={},
            is_verified=True,
            is_active=False,
        )
        user.set_password(user_password)
        user.save()

        inputs = [
            {
                'email': user.email,
                'password': 'asdad',
            },
            {
                'email': user.email,
                'password': '',
            },
            {
                'email': user.email,
            },
            {
                'email': 'invalid',
                'password': 'asdad',
            },
            {
                'password': '',
            },
            {
            },
        ]

        for inp in inputs:

            response = self.client.post(
                path='/sign-in',
                data=inp,
            )

            self.assertEqual(response.status_code, 200)

    def test_post_redirect_already_authenticated(self):

        self.assertTrue(self.client.login(username=self.user.username, password=self.user_password))

        response = self.client.post(
            path='/sign-in',
            data={
                'email': self.user.email,
                'password': self.user_password,
                'box-1': 'box-1',
            },
        )

        self.assertRedirects(response, reverse('dashboard'))
        self.client.logout()

        self.assertTrue('sessionid' not in str(response.cookies))
        self.assertTrue('csrftoken' not in str(response.cookies))
