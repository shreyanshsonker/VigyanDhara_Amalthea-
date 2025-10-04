#!/usr/bin/env python
"""
Script to create test companies and users for the expense management system
"""

import os
import sys
import django
from django.conf import settings

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'expense_management.settings')
django.setup()

from apps.companies.models import Company, CompanySettings, ExpenseCategory
from apps.accounts.models import User, UserProfile
from django.contrib.auth.hashers import make_password

def create_test_data():
    print("Creating test companies and users...")
    
    # Create Company 1: TechCorp
    company1, created = Company.objects.get_or_create(
        name="TechCorp Solutions",
        defaults={
            'slug': 'techcorp-solutions',
            'description': 'A leading technology company',
            'email': 'admin@techcorp.com',
            'phone_number': '+1-555-0123',
            'website': 'https://techcorp.com',
            'address_line_1': '123 Tech Street',
            'city': 'San Francisco',
            'state_province': 'CA',
            'postal_code': '94105',
            'country': 'United States',
            'industry': 'Technology',
            'company_size': '51-200',
            'currency': 'USD',
            'timezone': 'America/Los_Angeles',
            'is_active': True,
            'is_verified': True
        }
    )
    
    if created:
        print(f"Created company: {company1.name}")
        
        # Create company settings
        CompanySettings.objects.create(
            company=company1,
            max_expense_amount=5000.00,
            require_receipts=True,
            require_approval_for_all=False,
            auto_approve_under_amount=100.00,
            approval_workflow_enabled=True,
            require_manager_approval=True,
            escalation_hours=48
        )
        
        # Create expense categories
        categories = [
            {'name': 'Travel', 'description': 'Business travel expenses', 'color': '#3B82F6'},
            {'name': 'Meals', 'description': 'Business meals and entertainment', 'color': '#10B981'},
            {'name': 'Office Supplies', 'description': 'Office equipment and supplies', 'color': '#F59E0B'},
            {'name': 'Software', 'description': 'Software licenses and subscriptions', 'color': '#8B5CF6'},
            {'name': 'Training', 'description': 'Professional development and training', 'color': '#EF4444'}
        ]
        
        for cat_data in categories:
            ExpenseCategory.objects.create(
                company=company1,
                **cat_data
            )
    
    # Create Company 2: FinanceFirst
    company2, created = Company.objects.get_or_create(
        name="FinanceFirst Inc",
        defaults={
            'slug': 'financefirst-inc',
            'description': 'Financial services company',
            'email': 'admin@financefirst.com',
            'phone_number': '+1-555-0456',
            'website': 'https://financefirst.com',
            'address_line_1': '456 Finance Ave',
            'city': 'New York',
            'state_province': 'NY',
            'postal_code': '10001',
            'country': 'United States',
            'industry': 'Financial Services',
            'company_size': '201-500',
            'currency': 'USD',
            'timezone': 'America/New_York',
            'is_active': True,
            'is_verified': True
        }
    )
    
    if created:
        print(f"Created company: {company2.name}")
        
        # Create company settings
        CompanySettings.objects.create(
            company=company2,
            max_expense_amount=10000.00,
            require_receipts=True,
            require_approval_for_all=True,
            auto_approve_under_amount=50.00,
            approval_workflow_enabled=True,
            require_manager_approval=True,
            escalation_hours=24
        )
        
        # Create expense categories
        categories = [
            {'name': 'Client Entertainment', 'description': 'Client meetings and entertainment', 'color': '#3B82F6'},
            {'name': 'Travel', 'description': 'Business travel expenses', 'color': '#10B981'},
            {'name': 'Professional Services', 'description': 'Legal, accounting, and consulting', 'color': '#F59E0B'},
            {'name': 'Technology', 'description': 'IT equipment and software', 'color': '#8B5CF6'},
            {'name': 'Marketing', 'description': 'Marketing and advertising expenses', 'color': '#EF4444'}
        ]
        
        for cat_data in categories:
            ExpenseCategory.objects.create(
                company=company2,
                **cat_data
            )
    
    # Create users for TechCorp
    users_techcorp = [
        {
            'email': 'admin@techcorp.com',
            'username': 'admin_techcorp',
            'first_name': 'John',
            'last_name': 'Admin',
            'role': 'admin',
            'password': 'admin123'
        },
        {
            'email': 'manager@techcorp.com',
            'username': 'manager_techcorp',
            'first_name': 'Sarah',
            'last_name': 'Manager',
            'role': 'manager',
            'password': 'manager123'
        },
        {
            'email': 'employee1@techcorp.com',
            'username': 'employee1_techcorp',
            'first_name': 'Mike',
            'last_name': 'Employee',
            'role': 'employee',
            'password': 'employee123'
        },
        {
            'email': 'employee2@techcorp.com',
            'username': 'employee2_techcorp',
            'first_name': 'Lisa',
            'last_name': 'Developer',
            'role': 'employee',
            'password': 'employee123'
        }
    ]
    
    for user_data in users_techcorp:
        user, created = User.objects.get_or_create(
            email=user_data['email'],
            defaults={
                'username': user_data['username'],
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name'],
                'role': user_data['role'],
                'company': company1,
                'is_active': True,
                'is_verified': True
            }
        )
        
        if created:
            user.set_password(user_data['password'])
            user.save()
            print(f"Created user: {user.email} ({user.role})")
            
            # Create user profile
            UserProfile.objects.create(
                user=user,
                department='Engineering' if user.role == 'employee' else 'Management',
                job_title='Software Developer' if user.role == 'employee' else f'{user.role.title()}',
                employee_id=f'TC{user.id:03d}',
                timezone='America/Los_Angeles'
            )
    
    # Create users for FinanceFirst
    users_financefirst = [
        {
            'email': 'admin@financefirst.com',
            'username': 'admin_financefirst',
            'first_name': 'Robert',
            'last_name': 'Admin',
            'role': 'admin',
            'password': 'admin123'
        },
        {
            'email': 'manager@financefirst.com',
            'username': 'manager_financefirst',
            'first_name': 'Jennifer',
            'last_name': 'Manager',
            'role': 'manager',
            'password': 'manager123'
        },
        {
            'email': 'employee1@financefirst.com',
            'username': 'employee1_financefirst',
            'first_name': 'David',
            'last_name': 'Analyst',
            'role': 'employee',
            'password': 'employee123'
        },
        {
            'email': 'employee2@financefirst.com',
            'username': 'employee2_financefirst',
            'first_name': 'Emily',
            'last_name': 'Consultant',
            'role': 'employee',
            'password': 'employee123'
        }
    ]
    
    for user_data in users_financefirst:
        user, created = User.objects.get_or_create(
            email=user_data['email'],
            defaults={
                'username': user_data['username'],
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name'],
                'role': user_data['role'],
                'company': company2,
                'is_active': True,
                'is_verified': True
            }
        )
        
        if created:
            user.set_password(user_data['password'])
            user.save()
            print(f"Created user: {user.email} ({user.role})")
            
            # Create user profile
            UserProfile.objects.create(
                user=user,
                department='Finance' if user.role == 'employee' else 'Management',
                job_title='Financial Analyst' if user.role == 'employee' else f'{user.role.title()}',
                employee_id=f'FF{user.id:03d}',
                timezone='America/New_York'
            )
    
    # Set up manager relationships
    try:
        # TechCorp manager relationships
        techcorp_manager = User.objects.get(email='manager@techcorp.com')
        techcorp_employees = User.objects.filter(
            company=company1, 
            role='employee'
        )
        for employee in techcorp_employees:
            employee.manager = techcorp_manager
            employee.save()
        
        # FinanceFirst manager relationships
        financefirst_manager = User.objects.get(email='manager@financefirst.com')
        financefirst_employees = User.objects.filter(
            company=company2, 
            role='employee'
        )
        for employee in financefirst_employees:
            employee.manager = financefirst_manager
            employee.save()
        
        print("Set up manager relationships")
    except User.DoesNotExist as e:
        print(f"Error setting up manager relationships: {e}")
    
    print("\nTest data creation completed!")
    print("\nTest credentials:")
    print("TechCorp Solutions:")
    print("  Admin: admin@techcorp.com / admin123")
    print("  Manager: manager@techcorp.com / manager123")
    print("  Employee: employee1@techcorp.com / employee123")
    print("\nFinanceFirst Inc:")
    print("  Admin: admin@financefirst.com / admin123")
    print("  Manager: manager@financefirst.com / manager123")
    print("  Employee: employee1@financefirst.com / employee123")

if __name__ == '__main__':
    create_test_data()
