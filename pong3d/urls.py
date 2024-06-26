from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import ScoreViewSet

router = DefaultRouter()
router.register(r'scores', ScoreViewSet)

urlpatterns = [
    path('pong3d/', views.index, name='index'),
    path('api/', include(router.urls)),
]

