from rest_framework.views import APIView
from rest_framework.response import Response
from . import ml


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
