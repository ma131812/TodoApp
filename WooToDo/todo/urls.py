from django.urls import path
from .views import *



app_name="todo"

urlpatterns=[
    path("tasklist/",TaskListCRUDView.as_view(),name="task_list"),
    path("",SplashView.as_view(),name="splash"),
    path("show_done/",CompletedTaskListView.as_view(),name="done_task"),
    path("developers/",DevelopersView.as_view(),name="developers"),
]