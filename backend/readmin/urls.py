# from rest_framework.routers import SimpleRouter
from django.urls import path
from .views import MenuView, ModelListView,ModelRetrieveUpdateDestroyAPIView, ModelCreateAPIView


urlpatterns = [
    path("", MenuView.as_view(), name="home"),
    path("<str:appName>/<str:modelName>/",
         ModelListView.as_view(), name="model_list_view"),
    path("<str:appName>/<str:modelName>/<int:pk>/",
         ModelRetrieveUpdateDestroyAPIView.as_view(), name="item_retrieve_update_destroy"),
    path("<str:appName>/<str:modelName>/add/", 
         ModelCreateAPIView.as_view(), name="model_create_view"),
]
