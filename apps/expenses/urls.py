from django.urls import path
from . import views

urlpatterns = [
    # Expense endpoints will be added here
    path('', views.ExpenseListView.as_view(), name='expense-list'),
    path('<str:pk>/', views.ExpenseDetailView.as_view(), name='expense-detail'),
    path('submit/', views.ExpenseSubmitView.as_view(), name='expense-submit'),
    path('templates/', views.ExpenseTemplateListView.as_view(), name='expense-template-list'),
    path('templates/<int:pk>/', views.ExpenseTemplateDetailView.as_view(), name='expense-template-detail'),
    path('tags/', views.ExpenseTagListView.as_view(), name='expense-tag-list'),
    path('tags/<int:pk>/', views.ExpenseTagDetailView.as_view(), name='expense-tag-detail'),
    path('<str:expense_id>/comments/', views.ExpenseCommentListView.as_view(), name='expense-comment-list'),
    path('<str:expense_id>/receipts/', views.ExpenseReceiptListView.as_view(), name='expense-receipt-list'),
]
