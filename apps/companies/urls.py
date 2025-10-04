from django.urls import path
from . import views

urlpatterns = [
    # Company endpoints will be added here
    path('', views.CompanyListView.as_view(), name='company-list'),
    path('<int:pk>/', views.CompanyDetailView.as_view(), name='company-detail'),
    path('settings/', views.CompanySettingsView.as_view(), name='company-settings'),
    path('departments/', views.DepartmentListView.as_view(), name='department-list'),
    path('departments/<int:pk>/', views.DepartmentDetailView.as_view(), name='department-detail'),
    path('categories/', views.ExpenseCategoryListView.as_view(), name='category-list'),
    path('categories/<int:pk>/', views.ExpenseCategoryDetailView.as_view(), name='category-detail'),
    path('approval-rules/', views.ApprovalRuleListView.as_view(), name='approval-rule-list'),
    path('approval-rules/<int:pk>/', views.ApprovalRuleDetailView.as_view(), name='approval-rule-detail'),
    
    # Login-related endpoints
    path('login/companies/', views.get_companies_for_login, name='login-companies'),
    path('login/companies/<int:company_id>/users/', views.get_company_users, name='company-users'),
]
