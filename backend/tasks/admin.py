from django.contrib import admin
from .models import User, Task, Subtask, Attachment

admin.site.register(User)
admin.site.register(Task)
admin.site.register(Subtask)
admin.site.register(Attachment)