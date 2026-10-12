import json
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LogoutView as DLogoutView
from django.http import JsonResponse
from django.views.generic import CreateView
from django.contrib.auth import update_session_auth_hash 
from django.views import View
from django.shortcuts import redirect
from django.contrib.auth import authenticate ,login,get_user_model
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from . import forms
from django.contrib.auth import logout

User = get_user_model() 

def loginView(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        if not User.objects.filter(email=email).exists():
            print("user not found")
            request.session["register_email"] = email
            request.session["register_password"] = password
            return redirect("authentication:signup")
        user=User.objects.get(email=email)
        user = authenticate(request, username=user.username, password=password)
        if user is None:
            return render(request, "auth.html", {"error": "invalid password"})
        login(request, user)
        return redirect("/auth/login_OK/")
    
    return render(request, "auth.html")


class QuickRegisterView(CreateView):
    model = User
    template_name = "auth_OK_sighup.html"
    success_url = reverse_lazy("authentication:login_OK")
    
    form_class = forms.QuickRegisterForm  
    
    def get(self, request, *args, **kwargs):
        if not request.session.get("register_email"):
            return redirect("authentication:login_no_csrf")
        return super().get(request, *args, **kwargs)
    
    def get_initial(self):
        initial = super().get_initial()
        initial['email'] = self.request.session.get("register_email", "")
        return initial
    
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs.update({
            'session_email': self.request.session.get("register_email"),
            'session_password': self.request.session.get("register_password"),
        })
        return kwargs
    
    def form_valid(self, form):
        email = self.request.session.get("register_email")
        password = self.request.session.get("register_password")
        
        if not email or not password:
            form.add_error(None, "اطلاعات ثبت‌نام ناقص است")
            return self.form_invalid(form)
        
        if User.objects.filter(email=email).exists():
            form.add_error('email', 'این ایمیل قبلاً ثبت شده است')
            return self.form_invalid(form)
        
        user = form.save(commit=False)
        user.email = email
        user.set_password(password)
        user.save()
        
        if "register_email" in self.request.session:
            del self.request.session["register_email"]
        if "register_password" in self.request.session:
            del self.request.session["register_password"]
        
        login(self.request, user)
        
        return super().form_valid(form)
    
    def form_invalid(self, form):
        print("Form errors:", form.errors)  
        return super().form_invalid(form)
    
class LoginOkView(LoginRequiredMixin,View):
    login_url="/auth/login/"
    def get(self,request):
        return render(request,"auth_OK_login.html",{"user":request.user})
    
class EditeUserProfileView(LoginRequiredMixin,View):
    login_url="/auth/login/"
    def get(self ,request):
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({
                "username": request.user.username,
                "email": request.user.email,
            })    
        return render(request,"Edit_info.html",{"user":request.user})
    
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            user = request.user
            
            if 'username' in data and data['username']:
                if User.objects.filter(username=data['username']).exclude(id=user.id).exists():
                    return JsonResponse({
                        'status': 'error',
                        'message': 'این نام کاربری قبلاً استفاده شده است.'
                    }, status=400)
                user.username = data['username']
            
            if 'email' in data and data['email']:
                if User.objects.filter(email=data['email']).exclude(id=user.id).exists():
                    return JsonResponse({
                        'status': 'error',
                        'message': 'این ایمیل قبلاً استفاده شده است.'
                    }, status=400)
                user.email = data['email']
            
            if 'password' in data and data['password']:
                if len(data['password']) < 8:
                    return JsonResponse({
                        'status': 'error',
                        'message': 'رمز عبور باید حداقل 8 کاراکتر باشد.'
                    }, status=400)
                user.set_password(data['password'])
                password_changed = True
            else:
                password_changed = False
            
            user.save()
            
            if password_changed:
                update_session_auth_hash(request, user)
            
            return JsonResponse({
                'status': 'success',
                'message': 'اطلاعات با موفقیت به‌روزرسانی شد.'
            })
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)


    
class LogoutView(LoginRequiredMixin,DLogoutView):
    next_page = reverse_lazy('authentication:login')  
    http_method_names = ['get', 'post']
    def get(self, request):
        logout(request)
        return redirect('authentication:login')
    
    def post(self, request):
        return self.get(request)
    
    
