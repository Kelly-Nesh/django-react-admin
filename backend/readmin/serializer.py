from rest_framework import serializers


class BaseSerializer(serializers.ModelSerializer):
    """Base serializer with for registered apps models"""

    def __init__(self, *args, **kwargs):
        self.Meta.model = kwargs.pop("model")
        super().__init__(*args, **kwargs)

    class Meta:
        fields = "__all__"
