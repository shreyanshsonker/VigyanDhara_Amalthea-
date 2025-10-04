from django.urls import path
from . import views

urlpatterns = [
    # Approval endpoints will be added here
    path('workflows/', views.ApprovalWorkflowListView.as_view(), name='approval-workflow-list'),
    path('workflows/<int:pk>/', views.ApprovalWorkflowDetailView.as_view(), name='approval-workflow-detail'),
    path('history/', views.ApprovalHistoryListView.as_view(), name='approval-history-list'),
    path('bulk/', views.BulkApprovalView.as_view(), name='bulk-approval'),
    path('templates/', views.ApprovalTemplateListView.as_view(), name='approval-template-list'),
    path('templates/<int:pk>/', views.ApprovalTemplateDetailView.as_view(), name='approval-template-detail'),
]
