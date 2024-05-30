from django.contrib.auth.hashers import check_password
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from .models import User, Task, Subtask
from .serializers import UserSerializer, TaskSerializer, SubtaskSerializer

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    try:
        user = User.objects.get(username=request.user.username)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        data = request.data.copy()
        if 'delete_picture' in data and data['delete_picture'] == 'true':
            user.profile_picture.delete()
            user.profile_picture = None
        elif 'profile_picture' in request.FILES:
            data['profile_picture'] = request.FILES['profile_picture']
        
        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class SubtaskViewSet(viewsets.ModelViewSet):
    serializer_class = SubtaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Subtask.objects.filter(task__user=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    data = request.data

    if not check_password(data['old_password'], user.password):
        return Response({"old_password": "Wrong password."}, status=status.HTTP_400_BAD_REQUEST)

    if data['new_password'] != data['confirm_new_password']:
        return Response({"new_password": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(data['new_password'])
    user.save()
    return Response({"detail": "Password updated successfully."})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    user = request.user
    data = request.data

    if data['username'] != user.username:
        return Response({"username": "Wrong username."}, status=status.HTTP_400_BAD_REQUEST)

    user.delete()
    return Response({"detail": "Account deleted successfully."})