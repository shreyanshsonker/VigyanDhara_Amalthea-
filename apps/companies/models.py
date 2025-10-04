from django.db import models
from django.core.validators import RegexValidator


class Company(models.Model):
    """
    Company model representing organizations using the expense management system
    """
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    
    # Contact Information
    email = models.EmailField()
    phone_number = models.CharField(
        max_length=17,
        validators=[RegexValidator(
            regex=r'^\+?1?\d{9,15}$',
            message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
        )],
        blank=True
    )
    website = models.URLField(blank=True)
    
    # Address Information
    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    state_province = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    
    # Company Details
    industry = models.CharField(max_length=100, blank=True)
    company_size = models.CharField(
        max_length=20,
        choices=[
            ('1-10', '1-10 employees'),
            ('11-50', '11-50 employees'),
            ('51-200', '51-200 employees'),
            ('201-500', '201-500 employees'),
            ('500+', '500+ employees'),
        ],
        default='1-10'
    )
    tax_id = models.CharField(max_length=50, blank=True)
    
    # Settings
    currency = models.CharField(max_length=3, default='USD')
    timezone = models.CharField(max_length=50, default='UTC')
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'companies'
        verbose_name = 'Company'
        verbose_name_plural = 'Companies'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class CompanySettings(models.Model):
    """
    Company-specific settings and configurations
    """
    company = models.OneToOneField(Company, on_delete=models.CASCADE, related_name='settings')
    
    # Expense Settings
    max_expense_amount = models.DecimalField(max_digits=10, decimal_places=2, default=1000.00)
    require_receipts = models.BooleanField(default=True)
    require_approval_for_all = models.BooleanField(default=False)
    auto_approve_under_amount = models.DecimalField(max_digits=10, decimal_places=2, default=50.00)
    
    # Approval Workflow Settings
    approval_workflow_enabled = models.BooleanField(default=True)
    require_manager_approval = models.BooleanField(default=True)
    require_finance_approval = models.BooleanField(default=False)
    escalation_hours = models.PositiveIntegerField(default=48)
    
    # Notification Settings
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    notification_frequency = models.CharField(
        max_length=20,
        choices=[
            ('immediate', 'Immediate'),
            ('daily', 'Daily'),
            ('weekly', 'Weekly'),
        ],
        default='immediate'
    )
    
    # Integration Settings
    accounting_system = models.CharField(max_length=100, blank=True)
    api_enabled = models.BooleanField(default=False)
    webhook_url = models.URLField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'company_settings'
        verbose_name = 'Company Settings'
        verbose_name_plural = 'Company Settings'
    
    def __str__(self):
        return f"Settings for {self.company.name}"


class Department(models.Model):
    """
    Department model for organizing employees
    """
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    manager = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='managed_departments'
    )
    budget_limit = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'departments'
        verbose_name = 'Department'
        verbose_name_plural = 'Departments'
        unique_together = ['company', 'name']
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - {self.company.name}"


class ExpenseCategory(models.Model):
    """
    Expense categories for organizing expenses
    """
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='expense_categories')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color code
    icon = models.CharField(max_length=50, blank=True)  # Icon name for frontend
    is_active = models.BooleanField(default=True)
    requires_receipt = models.BooleanField(default=True)
    max_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'expense_categories'
        verbose_name = 'Expense Category'
        verbose_name_plural = 'Expense Categories'
        unique_together = ['company', 'name']
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - {self.company.name}"


class ApprovalRule(models.Model):
    """
    Approval rules for automated expense approval workflow
    """
    RULE_TYPES = [
        ('amount_threshold', 'Amount Threshold'),
        ('category_specific', 'Category Specific'),
        ('department_specific', 'Department Specific'),
        ('employee_specific', 'Employee Specific'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='approval_rules')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    rule_type = models.CharField(max_length=20, choices=RULE_TYPES)
    
    # Rule conditions
    amount_threshold = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    categories = models.ManyToManyField(ExpenseCategory, blank=True)
    departments = models.ManyToManyField(Department, blank=True)
    employees = models.ManyToManyField('accounts.User', blank=True)
    
    # Approval requirements
    requires_manager_approval = models.BooleanField(default=True)
    requires_finance_approval = models.BooleanField(default=False)
    requires_admin_approval = models.BooleanField(default=False)
    
    # Escalation
    escalation_hours = models.PositiveIntegerField(default=48)
    auto_approve_after_escalation = models.BooleanField(default=False)
    
    # Status
    is_active = models.BooleanField(default=True)
    priority = models.PositiveIntegerField(default=0)  # Higher number = higher priority
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'approval_rules'
        verbose_name = 'Approval Rule'
        verbose_name_plural = 'Approval Rules'
        ordering = ['-priority', 'name']
    
    def __str__(self):
        return f"{self.name} - {self.company.name}"
