from django.urls import path
from .views import signup, profile, TaskViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('profile/', profile, name='profile'),
]

urlpatterns += router.urls