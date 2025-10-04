from django.urls import path
from . import views

urlpatterns = [
    # Analytics endpoints will be added here
    path('expenses/', views.ExpenseAnalyticsView.as_view(), name='expense-analytics'),
    path('categories/', views.CategoryAnalyticsView.as_view(), name='category-analytics'),
    path('employees/', views.EmployeeAnalyticsView.as_view(), name='employee-analytics'),
    path('approvals/', views.ApprovalAnalyticsView.as_view(), name='approval-analytics'),
    path('reports/', views.ReportListView.as_view(), name='report-list'),
    path('reports/<int:pk>/', views.ReportDetailView.as_view(), name='report-detail'),
    path('reports/generate/', views.ReportGenerateView.as_view(), name='report-generate'),
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
    path('widgets/', views.DashboardWidgetListView.as_view(), name='dashboard-widget-list'),
    path('widgets/<int:pk>/', views.DashboardWidgetDetailView.as_view(), name='dashboard-widget-detail'),
    path('alerts/', views.AlertListView.as_view(), name='alert-list'),
    path('alerts/<int:pk>/', views.AlertDetailView.as_view(), name='alert-detail'),
]
