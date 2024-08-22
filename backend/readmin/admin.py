from . import model_form_list
from django import forms
from django.contrib.auth.models import User, Group
from django.contrib import admin
from . import register


register([Group, User])


@model_form_list.register
class GroupForm(forms.ModelForm):
    class Meta:
        model = Group
        fields = "__all__"


@model_form_list.register
class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = "__all__"
