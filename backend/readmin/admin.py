from django.contrib import admin

# Register your models here.
from django.contrib.auth.models import Group, User
from . import register


register(Group)
register(User)
