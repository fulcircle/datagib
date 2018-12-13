from datagib.settings.base import *

DEBUG = True

# This will be the super user credentials used to login to the Django Admin page
SUPERUSER = {
    'name': 'admin',
    'email': 'admin@example.com',
    'password': 'pass'
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'postgres',
        'USER': 'postgres',
        'PASSWORD': 'pass',
        'HOST': 'datagib_postgres',
        'PORT': '5432',
    }
}

SECRET_KEY = 'bvzh&txe6xd&()dd#fbr6h)8&!xq^229)dev-u*^df!yj)7u-!'
