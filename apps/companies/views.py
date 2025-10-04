from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Company, CompanySettings, Department, ExpenseCategory, ApprovalRule
from .serializers import (
    CompanySerializer, CompanySettingsSerializer, DepartmentSerializer, 
    ExpenseCategorySerializer, ApprovalRuleSerializer
)


class CompanyListView(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]


class CompanyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]


class CompanySettingsView(generics.RetrieveUpdateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]


class DepartmentListView(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]


class DepartmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]


class ExpenseCategoryListView(generics.ListCreateAPIView):
    queryset = ExpenseCategory.objects.all()
    serializer_class = ExpenseCategorySerializer
    permission_classes = [IsAuthenticated]


class ExpenseCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ExpenseCategory.objects.all()
    serializer_class = ExpenseCategorySerializer
    permission_classes = [IsAuthenticated]


class ApprovalRuleListView(generics.ListCreateAPIView):
    queryset = ApprovalRule.objects.all()
    serializer_class = ApprovalRuleSerializer
    permission_classes = [IsAuthenticated]


class ApprovalRuleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ApprovalRule.objects.all()
    serializer_class = ApprovalRuleSerializer
    permission_classes = [IsAuthenticated]


@api_view(['GET'])
@permission_classes([AllowAny])
def get_companies_for_login(request):
    """
    Get list of companies for login selection
    """
    companies = Company.objects.filter(is_active=True).values('id', 'name', 'slug')
    # Ensure IDs are integers
    companies_list = list(companies)
    for company in companies_list:
        company['id'] = int(company['id'])
    return Response(companies_list)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_company_users(request, company_id):
    """
    Get users for a specific company for role selection
    """
    from apps.accounts.models import User
    
    try:
        company = Company.objects.get(id=company_id, is_active=True)
        users = User.objects.filter(company=company, is_active=True).values(
            'id', 'email', 'first_name', 'last_name', 'role'
        )
        # Ensure IDs are integers
        users_list = list(users)
        for user in users_list:
            user['id'] = int(user['id'])
        return Response(users_list)
    except Company.DoesNotExist:
        return Response({'error': 'Company not found'}, status=404)
