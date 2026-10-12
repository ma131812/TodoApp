from django.contrib import admin
from authentication.models import *
from. import models

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display=["username","email"]

@admin.register(models.TaskModel)
class UserTaskAdmin(admin.ModelAdmin):
    list_display=["user","title","created_time"]