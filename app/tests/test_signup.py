from django.contrib.auth.hashers import check_password
from django.urls import reverse
from django.conf import settings

from ..models.user import User
from ..models.token import Token
from .classes import PMTestCase


class SignInViewTestCase(PMTestCase):

    def test_post_redirect_verify(self):

        email = 'owrfewferwfi@oi.com'
        firstname = 'ionf'
        lastname = 'ionl'
        password = 'ionelele'

        response = self.client.post(
            path='/sign-up',
            data={
                'firstname': firstname,
                'lastname': lastname,
                'email': email,
                'password': password,
            },
        )

        self.assertRedirects(response, reverse('verify-account'))
        self.assertTrue('sessionid' in str(response.cookies))
        self.assertTrue('csrftoken' in str(response.cookies))

        user = User.objects.filter(email=email).first()
        self.assertEqual(user.first_name, firstname)
        self.assertEqual(user.last_name, lastname)
        self.assertEqual(user.max_usage, settings.PLANS[settings.FREE_PLAN_ID]['max_usage'])
        self.assertTrue(check_password(password, user.password))

        token = Token.objects.filter(user=user).first()
        self.assertEqual(token.usage, Token.VERIFY_EMAIL)

    def test_post_redirect_invalid_form(self):

        email = 'owrfewferwfi@oi.com'
        firstname = 'ionf'
        lastname = 'ionl'
        password = 'ionelele'

        inputs = [
            {
                'email': 'd',
                'firstname': firstname,
                'lastname': lastname,
                'password': password,
            },
            {
                'email': email,
                'firstname': firstname,
                'lastname': lastname,
                'password': 'short',
            },
            {
                'email': email,
                'firstname': 31 * 'r',
                'lastname': lastname,
                'password': password,
            },
            {
                'email': email,
                'firstname': firstname,
                'lastname': 65 * 'r',
                'password': password,
            },
            {
                'email': email,
                'firstname': firstname,
                'lastname': lastname,
            },
            {
                'email': email,
                'firstname': firstname,
                'password': password,
            },
            {
                'email': email,
                'lastname': lastname,
                'password': password,
            },
        ]

        for inp in inputs:

            response = self.client.post(
                path='/sign-up',
                data=inp,
            )

            self.assertEqual(response.status_code, 200)

            user = User.objects.filter(email=inp['email']).first()
            self.assertFalse(user)
