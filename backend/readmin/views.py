from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication

import readmin
from . import ml
from .serializer import BaseSerializer


class BaseAuth:
    """Base authentication class"""
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]
    # pass

class HomeView(BaseAuth, APIView):
    """API endpoint for getting list of registered models"""

    def get(self, request):
        """Return list of registered models
            context (dict): 
                AppName (str): Models (list)
        """
        context = {}
        # Get list of models
        for m in ml.models:
            appName = m._meta.app_label.title()
            if appName not in context:
                context[appName] = []
            context[appName].append(m.__name__)

        return Response(context)


class ModelView(BaseAuth, APIView):
    """API endpoint for getting detailed information about a specific model"""

    def get(self, request, appName, modelName, pk=None):
        """Return detailed information about a specific model
            Parameters:
                modelName (str): Name of the model
            context (dict): 
                AppName (str): ModelName (str)
                ModelDescription (str): Description of the model
        """
        try:
            model = ml.get_model(appName, modelName)
        except readmin.models.ModelNotFoundError:
            return Response({"error": f"{modelName} is not a registered model for {appName}."}, status=status.HTTP_404_NOT_FOUND)
        if not pk:
            data = model.objects.all()
            serializer = BaseSerializer(data, model=model, many=True)
        else:
            data = model.objects.get(pk=pk)
            serializer = BaseSerializer(data, model=model)
        return Response(serializer.data)
