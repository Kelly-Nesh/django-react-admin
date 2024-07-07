from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from . import ml
from .serializer import BaseSerializer


class HomeView(APIView):
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


class ModelView(APIView):
    """API endpoint for getting detailed information about a specific model"""

    def get(self, request, modelName):
        """Return detailed information about a specific model
            Parameters:
                modelName (str): Name of the model
            context (dict): 
                AppName (str): ModelName (str)
                ModelDescription (str): Description of the model
        """
        try:
            model = ml.get_model(modelName)
        except ModuleNotFoundError:
            return Response({"error": f"{modelName} is not a registered model."}, status=status.HTTP_400_BAD_REQUEST)
        data = model.objects.all()
        serializer = BaseSerializer(data, model=model, many=True)
        return Response(serializer.data)
