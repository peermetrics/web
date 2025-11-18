import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# if we are running in appengine
# GAE_APPLICATION is set automatically
GAE_APP_NAME = os.getenv('GAE_APPLICATION', '')
if GAE_APP_NAME:
    split = GAE_APP_NAME.split('~')
    PROJECT_ID = split[1] if len(split) > 1 else 'local'

DEBUG = os.getenv('DEBUG', False) == 'True'

DEV = DEBUG

SECRET_KEY = os.getenv('SECRET_KEY')

ALLOWED_HOSTS = '*'

INSTALLED_APPS = [
    'app',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'web.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.jinja2.Jinja2',
        'DIRS': [
            'app/templates',
        ],
        'APP_DIRS': False,
        'OPTIONS': {
            'environment': 'app.jinja2_env.environment',
        },
    },
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'app/templates'), ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'web.wsgi.application'

# Running on production App Engine, so connect to Google Cloud SQL using
# the unix socket at /cloudsql/<your-cloudsql-connection string>
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'HOST': os.getenv('DATABASE_HOST'),
        'PORT': os.getenv('DATABASE_PORT'),
        'USER': os.getenv('DATABASE_USER'),
        'PASSWORD': os.getenv('DATABASE_PASSWORD'),
        'NAME': os.getenv('DATABASE_NAME'),
        'CONN_MAX_AGE': int(os.getenv('CONN_MAX_AGE')),
    },
}

# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

if DEBUG:
    AUTH_PASSWORD_VALIDATORS.clear()

PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
]

AUTH_USER_MODEL = 'app.User'
LOGIN_URL = '/login'
LOGIN_REDIRECT_URL = '/dashboard'
LOGOUT_REDIRECT_URL = '/login'

# Default admin password (used to detect default password on login)
DEFAULT_ADMIN_PASSWORD = os.getenv('DEFAULT_ADMIN_PASSWORD', 'admin')


# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = '/app/static'

DEFAULT_INTERVAL = 10000

# Messages
MESSAGE_STORAGE = 'django.contrib.messages.storage.session.SessionStorage'

# Sessions
SESSION_ENGINE = 'django.contrib.sessions.backends.cached_db'

if not DEV:
    SESSION_COOKIE_DOMAIN = os.getenv('COOKIE_DOMAIN')

SESSION_COOKIE_NAME = 'pmsession'
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_AGE = 2419200
SESSION_COOKIE_SECURE = not DEBUG  # Enable HTTPS-only cookies in production
SESSION_COOKIE_SAMESITE = 'Lax'  # Prevent CSRF attacks

EVENT_CATEGORIES = {
    'browser': 'B',
    'getUserMedia': 'M',
    'connection': 'C',
    'stats': 'S',
}

# Template settings: vars that will be made available in templates
TEMPLATE_VARS = {
    'apiRoot': os.getenv('API_ROOT'),
}
