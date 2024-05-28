from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    full_name = models.CharField(max_length=255)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    notes = models.TextField(blank=True, null=True)
    due_date = models.DateTimeField(null=True, blank=True)
    remind_me = models.DateTimeField(null=True, blank=True)
    complete = models.BooleanField(default=False)
    tags = models.CharField(max_length=255, blank=True, null=True)
    attachments = models.FileField(upload_to='attachments/', blank=True, null=True)
    subtasks = models.ManyToManyField('self', symmetrical=False, blank=True)

    def __str__(self):
        return self.title