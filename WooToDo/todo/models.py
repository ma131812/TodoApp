from django.db import models
from django.shortcuts import get_object_or_404

class TaskModel(models.Model):
    title=models.CharField(max_length=150,blank=False,null=False)
    discription=models.TextField(null=True,blank=True)
    created_time=models.DateTimeField(auto_now_add=True)
    update_time=models.DateTimeField(auto_now=True)
    is_done=models.BooleanField(default=False,blank=True)
    user=models.ForeignKey("authentication.User",on_delete=models.CASCADE,related_name="tasks")
    
    class Meta:
        indexes=[models.Index(fields=['update_time'])]
        ordering=["update_time"]