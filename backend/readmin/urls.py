# from rest_framework.routers import SimpleRouter
from django.urls import path
from .views import HomeView, ModelView


urlpatterns = [
    path("", HomeView.as_view(), name="home"),
    path("<str:appName>/<str:modelName>/",
         ModelView.as_view(), name="model_view"),
    path("<str:appName>/<str:modelName>/<int:pk>/",
         ModelView.as_view(), name="item_view"),
    path("<str:appName>/<str:modelName>/add/", 
         ModelView.as_view(), name="model_add"),
]
