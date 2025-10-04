from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from .models import ApprovalWorkflow, ApprovalHistory, BulkApproval, ApprovalTemplate
from .serializers import ApprovalWorkflowSerializer, ApprovalHistorySerializer, BulkApprovalSerializer, ApprovalTemplateSerializer


class ApprovalWorkflowListView(generics.ListCreateAPIView):
    serializer_class = ApprovalWorkflowSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'approver', 'expense__status']
    search_fields = ['expense__description', 'expense__id']
    ordering_fields = ['created_at', 'due_date']
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        
        # Base queryset filtered by company
        queryset = ApprovalWorkflow.objects.filter(expense__company=user.company)
        
        # Role-based filtering
        if user.role == 'employee':
            # Employees can only see approvals for their own expenses
            queryset = queryset.filter(expense__employee=user)
        elif user.role == 'manager':
            # Managers can see approvals for their subordinates and their own
            subordinate_ids = user.subordinates.values_list('id', flat=True)
            queryset = queryset.filter(
                models.Q(expense__employee=user) | 
                models.Q(expense__employee_id__in=subordinate_ids)
            )
        # Admins can see all approvals in their company (already filtered by company)
        
        return queryset


class ApprovalWorkflowDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ApprovalWorkflow.objects.all()
    serializer_class = ApprovalWorkflowSerializer
    permission_classes = [IsAuthenticated]




class ApprovalHistoryListView(generics.ListAPIView):
    queryset = ApprovalHistory.objects.all()
    serializer_class = ApprovalHistorySerializer
    permission_classes = [IsAuthenticated]


class BulkApprovalView(generics.CreateAPIView):
    queryset = BulkApproval.objects.all()
    serializer_class = BulkApprovalSerializer
    permission_classes = [IsAuthenticated]


class ApprovalTemplateListView(generics.ListCreateAPIView):
    queryset = ApprovalTemplate.objects.all()
    serializer_class = ApprovalTemplateSerializer
    permission_classes = [IsAuthenticated]


class ApprovalTemplateDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ApprovalTemplate.objects.all()
    serializer_class = ApprovalTemplateSerializer
    permission_classes = [IsAuthenticated]
