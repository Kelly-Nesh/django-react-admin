from django.urls import include, path
from rest_framework.routers import SimpleRouter
from .views import LoginAPIView, BasicAdminDisplay

router = SimpleRouter()
# router.register('', BasicAdminDisplay, basename='admin-basic')

urlpatterns = [
    path("login", LoginAPIView.as_view()),
    path("", BasicAdminDisplay.as_view())
    # path("", include(router.urls))
]