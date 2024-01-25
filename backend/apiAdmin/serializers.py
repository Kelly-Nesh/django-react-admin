from django.contrib.auth.models import User
from rest_framework import serializers as s
from .models import Events


class UserSerializer(s.ModelSerializer):
    groups = s.SerializerMethodField()
    class Meta:
        model = User
        fields = ['username', 'groups']

    def get_groups(self, obj):
        """Returns all user groups"""
        return [g['name'] for g in obj.groups.values("name")]


class EventsSerializer(s.ModelSerializer):
    class Meta:
        model = Events
        fields = "__all__"