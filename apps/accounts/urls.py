from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.UserListCreateView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('change-password/', views.change_password_view, name='change-password'),
    path('password-reset-request/', views.password_reset_request_view, name='password-reset-request'),
    path('password-reset-confirm/', views.password_reset_confirm_view, name='password-reset-confirm'),
    path('stats/', views.user_stats_view, name='user-stats'),
]
