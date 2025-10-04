from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal


class ExpenseAnalytics(models.Model):
    """
    Aggregated analytics data for expenses
    """
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='expense_analytics')
    employee = models.ForeignKey('accounts.User', on_delete=models.CASCADE, null=True, blank=True, related_name='expense_analytics')
    department = models.ForeignKey('companies.Department', on_delete=models.CASCADE, null=True, blank=True, related_name='expense_analytics')
    
    # Time period
    period_type = models.CharField(max_length=20, choices=[
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    ])
    period_start = models.DateField()
    period_end = models.DateField()
    
    # Aggregated data
    total_expenses = models.PositiveIntegerField(default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    average_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Status breakdown
    pending_count = models.PositiveIntegerField(default=0)
    approved_count = models.PositiveIntegerField(default=0)
    rejected_count = models.PositiveIntegerField(default=0)
    
    # Category breakdown (stored as JSON)
    category_breakdown = models.JSONField(default=dict)
    
    # Comparison data
    previous_period_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    period_over_period_change = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'expense_analytics'
        verbose_name = 'Expense Analytics'
        verbose_name_plural = 'Expense Analytics'
        unique_together = ['company', 'employee', 'department', 'period_type', 'period_start']
        ordering = ['-period_start']
    
    def __str__(self):
        return f"Analytics for {self.company.name} - {self.period_type} - {self.period_start}"


class CategoryAnalytics(models.Model):
    """
    Analytics data for expense categories
    """
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='category_analytics')
    category = models.ForeignKey('companies.ExpenseCategory', on_delete=models.CASCADE, related_name='analytics')
    
    # Time period
    period_type = models.CharField(max_length=20, choices=[
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    ])
    period_start = models.DateField()
    period_end = models.DateField()
    
    # Aggregated data
    total_expenses = models.PositiveIntegerField(default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    average_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    percentage_of_total = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    
    # Top employees for this category
    top_employees = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'category_analytics'
        verbose_name = 'Category Analytics'
        verbose_name_plural = 'Category Analytics'
        unique_together = ['company', 'category', 'period_type', 'period_start']
        ordering = ['-period_start', '-total_amount']
    
    def __str__(self):
        return f"{self.category.name} - {self.period_type} - {self.period_start}"


class EmployeeAnalytics(models.Model):
    """
    Analytics data for individual employees
    """
    employee = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='employee_analytics')
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='employee_analytics')
    
    # Time period
    period_type = models.CharField(max_length=20, choices=[
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    ])
    period_start = models.DateField()
    period_end = models.DateField()
    
    # Aggregated data
    total_expenses = models.PositiveIntegerField(default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    average_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Approval metrics
    approval_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    average_approval_time_hours = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    
    # Category breakdown
    category_breakdown = models.JSONField(default=dict)
    
    # Spending patterns
    spending_trend = models.CharField(max_length=20, choices=[
        ('increasing', 'Increasing'),
        ('decreasing', 'Decreasing'),
        ('stable', 'Stable'),
    ], blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'employee_analytics'
        verbose_name = 'Employee Analytics'
        verbose_name_plural = 'Employee Analytics'
        unique_together = ['employee', 'company', 'period_type', 'period_start']
        ordering = ['-period_start']
    
    def __str__(self):
        return f"{self.employee.full_name} - {self.period_type} - {self.period_start}"


class ApprovalAnalytics(models.Model):
    """
    Analytics data for approval workflows
    """
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='approval_analytics')
    approver = models.ForeignKey('accounts.User', on_delete=models.CASCADE, null=True, blank=True, related_name='approval_analytics')
    
    # Time period
    period_type = models.CharField(max_length=20, choices=[
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    ])
    period_start = models.DateField()
    period_end = models.DateField()
    
    # Approval metrics
    total_approvals = models.PositiveIntegerField(default=0)
    approved_count = models.PositiveIntegerField(default=0)
    rejected_count = models.PositiveIntegerField(default=0)
    escalated_count = models.PositiveIntegerField(default=0)
    
    # Timing metrics
    average_approval_time_hours = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    average_response_time_hours = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    
    # Overdue metrics
    overdue_count = models.PositiveIntegerField(default=0)
    overdue_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'approval_analytics'
        verbose_name = 'Approval Analytics'
        verbose_name_plural = 'Approval Analytics'
        unique_together = ['company', 'approver', 'period_type', 'period_start']
        ordering = ['-period_start']
    
    def __str__(self):
        approver_name = self.approver.full_name if self.approver else "All Approvers"
        return f"{approver_name} - {self.period_type} - {self.period_start}"


class Report(models.Model):
    """
    Generated reports for analytics
    """
    REPORT_TYPES = [
        ('expense_summary', 'Expense Summary'),
        ('category_breakdown', 'Category Breakdown'),
        ('employee_spending', 'Employee Spending'),
        ('approval_workflow', 'Approval Workflow'),
        ('monthly_report', 'Monthly Report'),
        ('quarterly_report', 'Quarterly Report'),
        ('annual_report', 'Annual Report'),
        ('custom', 'Custom Report'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('generating', 'Generating'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='reports')
    created_by = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='created_reports')
    
    # Report details
    name = models.CharField(max_length=200)
    report_type = models.CharField(max_length=30, choices=REPORT_TYPES)
    description = models.TextField(blank=True)
    
    # Time period
    start_date = models.DateField()
    end_date = models.DateField()
    
    # Filters
    filters = models.JSONField(default=dict)  # Applied filters
    
    # Status and file
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    file_path = models.CharField(max_length=500, blank=True)
    file_size = models.PositiveIntegerField(null=True, blank=True)
    
    # Generation details
    generation_started_at = models.DateTimeField(null=True, blank=True)
    generation_completed_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    
    # Access
    is_public = models.BooleanField(default=False)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'reports'
        verbose_name = 'Report'
        verbose_name_plural = 'Reports'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.company.name}"


class DashboardWidget(models.Model):
    """
    Dashboard widgets for analytics display
    """
    WIDGET_TYPES = [
        ('kpi', 'KPI Card'),
        ('chart', 'Chart'),
        ('table', 'Table'),
        ('gauge', 'Gauge'),
        ('trend', 'Trend Line'),
    ]
    
    CHART_TYPES = [
        ('bar', 'Bar Chart'),
        ('line', 'Line Chart'),
        ('pie', 'Pie Chart'),
        ('doughnut', 'Doughnut Chart'),
        ('area', 'Area Chart'),
        ('scatter', 'Scatter Plot'),
    ]
    
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='dashboard_widgets')
    created_by = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='created_widgets')
    
    # Widget details
    name = models.CharField(max_length=200)
    widget_type = models.CharField(max_length=20, choices=WIDGET_TYPES)
    chart_type = models.CharField(max_length=20, choices=CHART_TYPES, blank=True)
    description = models.TextField(blank=True)
    
    # Configuration
    config = models.JSONField(default=dict)  # Widget configuration
    position_x = models.PositiveIntegerField(default=0)
    position_y = models.PositiveIntegerField(default=0)
    width = models.PositiveIntegerField(default=4)
    height = models.PositiveIntegerField(default=3)
    
    # Data source
    data_source = models.CharField(max_length=100)  # Which analytics model to use
    filters = models.JSONField(default=dict)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_public = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'dashboard_widgets'
        verbose_name = 'Dashboard Widget'
        verbose_name_plural = 'Dashboard Widgets'
        ordering = ['position_y', 'position_x']
    
    def __str__(self):
        return f"{self.name} - {self.company.name}"


class Alert(models.Model):
    """
    Analytics alerts and thresholds
    """
    ALERT_TYPES = [
        ('expense_threshold', 'Expense Threshold'),
        ('approval_overdue', 'Approval Overdue'),
        ('budget_exceeded', 'Budget Exceeded'),
        ('unusual_spending', 'Unusual Spending'),
        ('category_limit', 'Category Limit'),
        ('monthly_limit', 'Monthly Limit'),
    ]
    
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='alerts')
    created_by = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='created_alerts')
    
    # Alert details
    name = models.CharField(max_length=200)
    alert_type = models.CharField(max_length=30, choices=ALERT_TYPES)
    description = models.TextField(blank=True)
    
    # Conditions
    conditions = models.JSONField(default=dict)  # Alert conditions
    threshold_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    
    # Recipients
    recipients = models.ManyToManyField('accounts.User', related_name='alerts')
    
    # Status
    is_active = models.BooleanField(default=True)
    last_triggered = models.DateTimeField(null=True, blank=True)
    trigger_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'alerts'
        verbose_name = 'Alert'
        verbose_name_plural = 'Alerts'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.company.name}"
