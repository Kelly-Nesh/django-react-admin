# from rest_framework.routers import SimpleRouter
from django.urls import path
from .views import HomeView, ModelView


urlpatterns = [
    path("/", HomeView.as_view(), name="home"),
    path("<str:modelName>/", ModelView.as_view(), name="model_view"),
]
