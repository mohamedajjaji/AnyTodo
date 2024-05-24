from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    full_name = models.CharField(max_length=255)

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    notes = models.TextField(blank=True, null=True)
    due_date = models.DateTimeField(null=True, blank=True)
    remind_me = models.BooleanField(default=False)
    priority = models.BooleanField(default=False)
    attachments = models.FileField(upload_to='attachments/', blank=True, null=True)
    subtasks = models.ManyToManyField('self', symmetrical=False, blank=True)

    def __str__(self):
        return self.title