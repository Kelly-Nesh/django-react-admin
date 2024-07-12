from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db import models

import readmin
from . import model_list
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
        context = {
            "models": {}
        }
        # Get list of models
        for v in model_list.models.values():
            appName = v._meta.app_label.lower()
            if request.user.has_perm(f'{appName}.view_{v.__name__.lower()}'):
                if appName not in context['models']:
                    context['models'][appName] = []
                context['models'][appName].append(v.__name__)
        if request.user.is_staff:
            context['perms'] = request.user.get_all_permissions()
        return Response(context)


class ModelView(BaseAuth, APIView):
    """API endpoint for getting detailed information about a specific model"""

    def get_model(self, appName, modelName):
        """Retrieve a model based on the given app name and model name"""
        try:
            model = model_list.get_model(appName, modelName)
        except readmin.models.ModelNotFoundError:
            return Response({"error": f"{modelName} is not a registered model for {appName}."}, status=status.HTTP_404_NOT_FOUND)
        return model

    def get_instance(self, model, pk):
        """Retrieve an instance of a model based on the given primary key"""
        try:
            instance = model.objects.get(pk=pk)
        except model.DoesNotExist:
            return Response({"error": f"Model with id '{pk}' does not exist."}, status=status.HTTP_404_NOT_FOUND)
        return instance

    def get(self, request, appName, modelName, pk=None):
        """Return detailed information about a specific model
            Parameters:
                modelName (str): Name of the model
            context (dict): 
                AppName (str): ModelName (str)
                ModelDescription (str): Description of the model
        """
        if not request.user.has_perm(f"{appName.lower()}.view_{modelName.lower()}"):
            return Response({"error": "You do not have the required permissions"}, status=status.HTTP_401_UNAUTHORIZED)
        model = self.get_model(appName, modelName)
        if isinstance(model, Response):
            return model
        if not pk:
            data = model.objects.all()
            serializer = BaseSerializer(data, model=model, many=True)
        else:
            data = model.objects.get(pk=pk)
            serializer = BaseSerializer(data, model=model)
        return Response(serializer.data)

    def post(self, request, appName, modelName):
        """Create a new instance of a specific model
        """
        if not request.user.has_perm(f"{appName.lower()}.add_{modelName.lower()}"):
            return Response({"error": "You do not have the required permissions"}, status=status.HTTP_401_UNAUTHORIZED)
        model = self.get_model(appName, modelName)
        if isinstance(model, Response):
            return model
        data = request.data
        created_model = model.objects.create(**data)
        if created_model:
            return Response({"success": f"{created_model} created successfuly"}, status=status.HTTP_201_CREATED)
        return Response({"error": "Not created"}, status)

    def put(self, request, appName, modelName, pk):
        """Update an existing instance of a specific model
        """
        if not request.user.has_perm(f"{appName.lower()}.change_{modelName.lower()}"):
            return Response({"error": "You do not have the required permissions"}, status=status.HTTP_401_UNAUTHORIZED)
        model = self.get_model(appName, modelName)
        if isinstance(model, Response):
            return model
        data = request.data
        instance = self.get_instance(model, pk)
        if isinstance(instance, Response):
            return instance
        updated = instance.update(**data)
        if updated:
            return Response({"success": f"{instance[0].name} updated successfuly"}, status=status.HTTP_200_OK)
        return Response({"error": "Not updated"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, appName, modelName, pk):
        """Delete an existing instance of a specific model"""
        if not request.user.has_perm(f"{appName.lower()}.delete_{modelName.lower()}"):
            return Response({"error": "You do not have the required permissions"}, status=status.HTTP_401_UNAUTHORIZED)
        model = self.get_model(appName, modelName)
        if isinstance(model, Response):
            return model
        instance = self.get_instance(model, pk)
        if isinstance(instance, Response):
            return instance
        instance.delete()
        return Response({"success": f"{modelName} instance deleted successfuly"}, status=status.HTTP_200_OK)
