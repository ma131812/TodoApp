from django import forms
from django.contrib.auth.forms import AuthenticationForm
from . import models


class Loginform(AuthenticationForm):
    pass
    
class QuickRegisterForm(forms.ModelForm):
    class Meta:
        model = models.User
        fields = ['username']  
        
    def __init__(self, *args, **kwargs):
        self.session_email = kwargs.pop('session_email', None)
        self.session_password = kwargs.pop('session_password', None)
        super().__init__(*args, **kwargs)
        
    def save(self, commit=True):
        user = super().save(commit=False)
        if self.session_email:
            user.email = self.session_email
        if self.session_password:
            user.set_password(self.session_password)
        if commit:
            user.save()
        return user
    
    
    