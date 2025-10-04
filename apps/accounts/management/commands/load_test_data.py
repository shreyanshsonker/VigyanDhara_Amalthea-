from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
import json
import os
from apps.companies.models import Company, CompanySettings, ExpenseCategory
from apps.accounts.models import User, UserProfile


class Command(BaseCommand):
    help = 'Load test data from JSON file'

    def handle(self, *args, **options):
        # Get the path to the test data JSON file
        json_file_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),
            'test_data.json'
        )
        
        try:
            with open(json_file_path, 'r') as file:
                data = json.load(file)
        except FileNotFoundError:
            self.stdout.write(
                self.style.ERROR('test_data.json file not found')
            )
            return
        except json.JSONDecodeError:
            self.stdout.write(
                self.style.ERROR('Invalid JSON in test_data.json')
            )
            return

        self.stdout.write('Loading test data...')

        for company_data in data['companies']:
            # Create or get company
            company, created = Company.objects.get_or_create(
                name=company_data['name'],
                defaults={
                    'slug': company_data['slug'],
                    'description': company_data['description'],
                    'email': company_data['email'],
                    'phone_number': company_data['phone_number'],
                    'website': company_data['website'],
                    'address_line_1': company_data['address_line_1'],
                    'city': company_data['city'],
                    'state_province': company_data['state_province'],
                    'postal_code': company_data['postal_code'],
                    'country': company_data['country'],
                    'industry': company_data['industry'],
                    'company_size': company_data['company_size'],
                    'currency': company_data['currency'],
                    'timezone': company_data['timezone'],
                    'is_active': company_data['is_active'],
                    'is_verified': company_data['is_verified']
                }
            )

            if created:
                self.stdout.write(f'Created company: {company.name}')
                
                # Create company settings
                CompanySettings.objects.create(
                    company=company,
                    max_expense_amount=5000.00,
                    require_receipts=True,
                    require_approval_for_all=False,
                    auto_approve_under_amount=100.00,
                    approval_workflow_enabled=True,
                    require_manager_approval=True,
                    escalation_hours=48
                )
                
                # Create expense categories
                for cat_data in company_data['expense_categories']:
                    ExpenseCategory.objects.create(
                        company=company,
                        **cat_data
                    )
            else:
                self.stdout.write(f'Company already exists: {company.name}')

            # Create users
            manager = None
            for user_data in company_data['users']:
                user, created = User.objects.get_or_create(
                    email=user_data['email'],
                    defaults={
                        'username': user_data['username'],
                        'first_name': user_data['first_name'],
                        'last_name': user_data['last_name'],
                        'role': user_data['role'],
                        'company': company,
                        'is_active': True,
                        'is_verified': True
                    }
                )

                if created:
                    user.set_password(user_data['password'])
                    user.save()
                    self.stdout.write(f'Created user: {user.email} ({user.role})')
                    
                    # Create user profile
                    UserProfile.objects.create(
                        user=user,
                        department='Engineering' if user.role == 'employee' else 'Management',
                        job_title='Software Developer' if user.role == 'employee' else f'{user.role.title()}',
                        employee_id=f'{company.slug.upper()[:2]}{user.id:03d}',
                        timezone=company.timezone
                    )
                    
                    # Store manager for later
                    if user.role == 'manager':
                        manager = user
                else:
                    self.stdout.write(f'User already exists: {user.email}')

            # Set up manager relationships
            if manager:
                employees = User.objects.filter(
                    company=company, 
                    role='employee'
                )
                for employee in employees:
                    employee.manager = manager
                    employee.save()
                self.stdout.write(f'Set up manager relationships for {company.name}')

        self.stdout.write(
            self.style.SUCCESS('Test data loaded successfully!')
        )
        
        self.stdout.write('\nTest credentials:')
        for company_data in data['companies']:
            self.stdout.write(f'\n{company_data["name"]}:')
            for user_data in company_data['users']:
                self.stdout.write(f'  {user_data["role"].title()}: {user_data["email"]} / {user_data["password"]}')
