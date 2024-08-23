from rest_framework.generics import GenericAPIView, ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.authentication import JWTAuthentication  # type: ignore
from django.db import models
from django.http import JsonResponse


from .models import ModelNotFoundError
from . import model_list, model_form_list
from .serializer import BaseSerializer


class BaseAuth:
    """Base authentication class"""
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser, IsAuthenticated]
    # pass


class MenuView(BaseAuth, ListAPIView):
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

class ModelBase(BaseAuth):
    """Base model class"""
    pagination_class = PageNumberPagination

    def get_model(self, appName, modelName):
        """Retrieve a model based on the given app name and model name"""
        try:
            model = model_list.get_model(appName, modelName)
        except ModelNotFoundError:
            return Response({"error": f"{modelName} is not a registered model for {appName}."}, status=status.HTTP_404_NOT_FOUND)
        return model


class ModelView(BaseAuth, GenericAPIView):
    """API endpoint for listing all models and 
        getting detailed information about a specific model"""
    pagination_class = PageNumberPagination

    def get_model(self, appName, modelName):
        """Retrieve a model based on the given app name and model name"""
        try:
            model = model_list.get_model(appName, modelName)
        except ModelNotFoundError:
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
            return Response(serializer.data)
        else:
            data = model.objects.get(pk=pk)
            modelForm = model_form_list.get_form(model, data)
            if modelForm is not None:
                # print(modelForm)
                return Response(f"{modelForm.as_table()}")
            return Response("sth went wrong", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ModelCreateAPIView(ModelBase, CreateAPIView):
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


class ModelRetrieveUpdateDestroyAPIView(ModelBase, RetrieveUpdateDestroyAPIView):

    def get(self, request, appName, modelName, pk):
        """
        Retrieve an existing instance of a specific model.
        
        Parameters:
            request (Request): The incoming HTTP request.
            appName (str): The name of the application.
            modelName (str): The name of the model.
            pk (int): The primary key of the instance to retrieve.
        
        Returns:
            Response: A response containing the retrieved instance, or an error message if the instance cannot be retrieved.
        """
        model = self.get_model(appName, modelName)
        data = model.objects.get(pk=pk)
        modelForm = model_form_list.get_form(model, data)
        if modelForm is not None:
            # print(modelForm)
            return Response(f"{modelForm.as_table()}")
        return Response("sth went wrong", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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


class ModelListView(ModelBase, ListAPIView):
    """API endpoint for listing data for a model"""
    pagination_class = PageNumberPagination
    page_size = 5

    def get(self, request, appName, modelName):
        """Return model list if user has permissions"""
        if not request.user.has_perm(f"{appName.lower()}.view_{modelName.lower()}"):
            return Response({"error": "You do not have the required permissions"}, status=status.HTTP_401_UNAUTHORIZED)
        model = self.get_model(appName, modelName)
        if isinstance(model, Response):
            return model
        data = model.objects.all()
        serializer = BaseSerializer(data, model=model, many=True)
        # return Response(serializer.data)

        page = self.paginate_queryset(serializer.data)
        return self.get_paginated_response(page)