import json
from django.shortcuts import render
from django.shortcuts import redirect
from django.views.generic import TemplateView
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from datetime import timedelta
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from . import models

class SplashView(TemplateView):
    template_name = "splash.html"
    @csrf_exempt
    def post(self,request):
        user = request.user

        if not user.is_authenticated:
            return JsonResponse({"recent_login": False})

        last_login = user.last_login
        if last_login and last_login >= timezone.now() - timedelta(days=14):
            return JsonResponse({"recent_login": True})

        return JsonResponse({"recent_login": False})
    
class DevelopersView(TemplateView):
    template_name = "developers.html"
    
class TaskListCRUDView(LoginRequiredMixin,View):
    login_url = "/auth/login/"
    def get(self,request):
        user=request.user
        tasks=models.TaskModel.objects.filter(user=user,is_done=False)
        return render(request,"index.html",{"user":user,"tasks":tasks})
        
    
    def post(self,request):
        data=json.loads(request.body)
        title = data.get('title')
        description=data.get("description")
        models.TaskModel.objects.create(
            title=title,
            discription=description,
            user=request.user
        )
        return JsonResponse({
                    'status': 'success',
                }, status=200)

    def put(self, request):
        data = json.loads(request.body)
        task = models.TaskModel.objects.get(
            id=data["id"],
            user=request.user
        )
        if not data.get("toggle_done"):
            task.title = data["title"]
            task.discription = data.get("description", "")

        else:
            task.is_done = not task.is_done
        task.save()
        return JsonResponse({"status": "success"})
        
        
        
    def delete(self,request):
        print("delete: ",end="")
        data=json.loads(request.body)
        delete_all = data.get('delete_all', False)
        if delete_all:
            print(f"delete_all user:{request.user.username}")
            tasks=models.TaskModel.objects.filter(user=request.user)
            tasks.delete()
            return JsonResponse({
                    'status': 'success',
                }, status=200)
        id=data.get("id")
        models.TaskModel.objects.filter(user=request.user,id=id).delete()
        return JsonResponse({
                'status': 'success',
            }, status=200)
        
    
class CompletedTaskListView(LoginRequiredMixin,View):
    login_url = "/accounts/login/"
    def get(self,request):
        user=request.user
        tasks=models.TaskModel.objects.filter(user=user,is_done=True)
        return render(request,"Done.html",{"user":user,"tasks":tasks})
    def put(self,request):
        data = json.loads(request.body)
        task = models.TaskModel.objects.get(
            id=data["id"],
            user=request.user
        )
        task.is_done = not task.is_done
        task.save()
        return JsonResponse({
                'status': 'success',
            }, status=200)

    
