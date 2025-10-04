from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from .models import Expense
from .serializers import ExpenseSerializer


class ExpenseListView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category', 'employee', 'expense_date']
    search_fields = ['description', 'merchant', 'id']
    ordering_fields = ['expense_date', 'submission_date', 'amount']
    ordering = ['-submission_date']
    
    def get_queryset(self):
        user = self.request.user
        
        # Base queryset filtered by company
        queryset = Expense.objects.filter(company=user.company)
        
        # Role-based filtering
        if user.role == 'employee':
            # Employees can only see their own expenses
            queryset = queryset.filter(employee=user)
        elif user.role == 'manager':
            # Managers can see expenses from their subordinates and their own
            subordinate_ids = user.subordinates.values_list('id', flat=True)
            queryset = queryset.filter(
                models.Q(employee=user) | 
                models.Q(employee_id__in=subordinate_ids)
            )
        # Admins can see all expenses in their company (already filtered by company)
        
        return queryset


class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Base queryset filtered by company
        queryset = Expense.objects.filter(company=user.company)
        
        # Role-based filtering
        if user.role == 'employee':
            # Employees can only see their own expenses
            queryset = queryset.filter(employee=user)
        elif user.role == 'manager':
            # Managers can see expenses from their subordinates and their own
            subordinate_ids = user.subordinates.values_list('id', flat=True)
            queryset = queryset.filter(
                models.Q(employee=user) | 
                models.Q(employee_id__in=subordinate_ids)
            )
        # Admins can see all expenses in their company (already filtered by company)
        
        return queryset


class ExpenseSubmitView(generics.CreateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]


class ExpenseTemplateListView(generics.ListCreateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]


class ExpenseTemplateDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]


class ExpenseTagListView(generics.ListCreateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]


class ExpenseTagDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]


class ExpenseCommentListView(generics.ListCreateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]


class ExpenseReceiptListView(generics.ListCreateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
