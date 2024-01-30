from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAdminUser

from .serializers import UserSerializer
from .models import Events
from .serializers import EventsSerializer

"""Return all models which user has access to"""


class LoginAPIView(APIView):
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        username = request.data['username']
        password = request.data['password']

        user = authenticate(username=username, password=password)
        if user and user.is_staff:
            token = Token.objects.get_or_create(user=user)[0]
            # user = UserSerializer(instance=user).data
            return Response({'token': token.key})
        else:
            return Response({'error': "Invalid credentials"}, status=401)


class BasicAdminDisplay(APIView):
    """Returns a json response of all models which the user has access to"""
    permission_classes = [IsAdminUser]

    MODELS = [
        ('Events', Events, EventsSerializer)
    ]

    def get(self, request):
        models = {}
        for model in self.MODELS:
            models[model[0]] = model[2](model[1].objects.order_by("-id"),
                                        many=True).data
        return Response(data=models)
