from django.urls import path
from .views import signup, profile, TaskViewSet, SubtaskViewSet, change_password, delete_account
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'subtasks', SubtaskViewSet, basename='subtask')

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('profile/', profile, name='profile'),
    path('change_password/', change_password, name='change_password'),
    path('delete_account/', delete_account, name='delete_account'),
]

urlpatterns += router.urls