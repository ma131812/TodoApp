from django.urls import path
from .views import *
from django.views.generic import TemplateView

app_name="authentication"

urlpatterns=[
     path("login/",loginView,name="login"),
     path("signup/",QuickRegisterView.as_view(),name="signup"),
     path("login_OK/",LoginOkView.as_view(),name="login_OK"),
     path("edit_info/",EditeUserProfileView.as_view(),name="user_edit_info"),
     path("logout/",LogoutView.as_view(),name="logout")
 ]