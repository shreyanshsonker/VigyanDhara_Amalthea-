#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'expense_management.settings')
django.setup()

from apps.accounts.models import User, UserProfile
from apps.companies.models import Company

def create_test_users():
    # Create a test company
    company, created = Company.objects.get_or_create(
        name="ExpenseFlow Demo Company",
        defaults={
            'slug': 'expenseflow-demo',
            'email': 'contact@expenseflow.com',
            'address_line_1': '123 Business St',
            'city': 'New York',
            'state_province': 'NY',
            'postal_code': '10001',
            'country': 'United States',
            'currency': 'USD',
            'timezone': 'UTC',
            'is_active': True
        }
    )
    
    # Create admin user
    admin_user, created = User.objects.get_or_create(
        email='admin@expenseflow.com',
        defaults={
            'username': 'admin',
            'first_name': 'Admin',
            'last_name': 'User',
            'role': 'admin',
            'is_staff': True,
            'is_superuser': True,
            'is_active': True,
            'company': company
        }
    )
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
        print(f"Created admin user: {admin_user.email}")
    else:
        print(f"Admin user already exists: {admin_user.email}")
    
    # Create manager user
    manager_user, created = User.objects.get_or_create(
        email='manager@expenseflow.com',
        defaults={
            'username': 'manager',
            'first_name': 'Manager',
            'last_name': 'User',
            'role': 'manager',
            'is_active': True,
            'company': company
        }
    )
    if created:
        manager_user.set_password('manager123')
        manager_user.save()
        print(f"Created manager user: {manager_user.email}")
    else:
        print(f"Manager user already exists: {manager_user.email}")
    
    # Create employee user
    employee_user, created = User.objects.get_or_create(
        email='employee@expenseflow.com',
        defaults={
            'username': 'employee',
            'first_name': 'Employee',
            'last_name': 'User',
            'role': 'employee',
            'is_active': True,
            'company': company,
            'manager': manager_user
        }
    )
    if created:
        employee_user.set_password('employee123')
        employee_user.save()
        print(f"Created employee user: {employee_user.email}")
    else:
        print(f"Employee user already exists: {employee_user.email}")
    
    # Create user profiles
    for user in [admin_user, manager_user, employee_user]:
        profile, created = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'department': 'IT' if user.role == 'admin' else 'Operations',
                'job_title': 'System Administrator' if user.role == 'admin' else f'{user.role.title()}',
                'employee_id': f'EMP{user.id:03d}',
                'timezone': 'UTC',
                'language': 'en'
            }
        )
        if created:
            print(f"Created profile for {user.email}")

if __name__ == '__main__':
    create_test_users()
    print("Test users created successfully!")
