# from rest_framework.routers import SimpleRouter
from django.urls import path
from .views import HomeView

# router = SimpleRouter()
# router.register("", HomeView, basename="home")


# urlpatterns = router.urls()
urlpatterns = [
    path("", HomeView.as_view(), name="home"),
]
