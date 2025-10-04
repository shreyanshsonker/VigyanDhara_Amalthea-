from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class Expense(models.Model):
    """
    Main expense model representing individual expense submissions
    """
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('corporate_card', 'Corporate Card'),
        ('bank_transfer', 'Bank Transfer'),
        ('check', 'Check'),
        ('other', 'Other'),
    ]
    
    # Basic Information
    id = models.CharField(max_length=20, primary_key=True)  # Custom ID like EXP-2024-001
    employee = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='expenses')
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='expenses')
    
    # Expense Details
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    currency = models.CharField(max_length=3, default='USD')
    category = models.ForeignKey('companies.ExpenseCategory', on_delete=models.PROTECT, related_name='expenses')
    description = models.TextField()
    expense_date = models.DateField()
    submission_date = models.DateTimeField(auto_now_add=True)
    
    # Additional Details
    merchant = models.CharField(max_length=200, blank=True)
    location = models.CharField(max_length=200, blank=True)
    project_code = models.CharField(max_length=50, blank=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='credit_card')
    
    # Tax Information
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    
    # Status and Priority
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    
    # Approval Information
    approved_by = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_expenses'
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    rejected_by = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='rejected_expenses'
    )
    rejected_at = models.DateTimeField(null=True, blank=True)
    
    # Additional Fields
    notes = models.TextField(blank=True)
    is_billable = models.BooleanField(default=False)
    client_name = models.CharField(max_length=200, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'expenses'
        verbose_name = 'Expense'
        verbose_name_plural = 'Expenses'
        ordering = ['-submission_date']
        indexes = [
            models.Index(fields=['employee', 'status']),
            models.Index(fields=['company', 'status']),
            models.Index(fields=['expense_date']),
            models.Index(fields=['submission_date']),
        ]
    
    def __str__(self):
        return f"{self.id} - {self.employee.full_name} - ${self.amount}"
    
    def save(self, *args, **kwargs):
        if not self.id:
            # Generate custom ID
            from django.utils import timezone
            year = timezone.now().year
            last_expense = Expense.objects.filter(
                id__startswith=f'EXP-{year}'
            ).order_by('-id').first()
            
            if last_expense:
                last_number = int(last_expense.id.split('-')[-1])
                new_number = last_number + 1
            else:
                new_number = 1
            
            self.id = f'EXP-{year}-{new_number:03d}'
        
        super().save(*args, **kwargs)


class ExpenseReceipt(models.Model):
    """
    Receipt attachments for expenses
    """
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE, related_name='receipts')
    receipt_file = models.FileField(upload_to='expense_receipts/')
    file_name = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField()
    file_type = models.CharField(max_length=100)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    # OCR Data (if available)
    ocr_text = models.TextField(blank=True)
    ocr_confidence = models.FloatField(null=True, blank=True)
    merchant_from_ocr = models.CharField(max_length=200, blank=True)
    amount_from_ocr = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    date_from_ocr = models.DateField(null=True, blank=True)
    
    class Meta:
        db_table = 'expense_receipts'
        verbose_name = 'Expense Receipt'
        verbose_name_plural = 'Expense Receipts'
    
    def __str__(self):
        return f"Receipt for {self.expense.id}"


class ExpenseComment(models.Model):
    """
    Comments on expenses for communication between employees and approvers
    """
    COMMENT_TYPES = [
        ('general', 'General Comment'),
        ('approval', 'Approval Comment'),
        ('rejection', 'Rejection Comment'),
        ('request_info', 'Request for Information'),
        ('system', 'System Comment'),
    ]
    
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='expense_comments')
    comment_type = models.CharField(max_length=20, choices=COMMENT_TYPES, default='general')
    content = models.TextField()
    is_internal = models.BooleanField(default=False)  # Internal comments not visible to employee
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'expense_comments'
        verbose_name = 'Expense Comment'
        verbose_name_plural = 'Expense Comments'
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment by {self.author.full_name} on {self.expense.id}"


class ExpenseTag(models.Model):
    """
    Tags for categorizing and filtering expenses
    """
    name = models.CharField(max_length=50, unique=True)
    color = models.CharField(max_length=7, default='#6B7280')  # Hex color code
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'expense_tags'
        verbose_name = 'Expense Tag'
        verbose_name_plural = 'Expense Tags'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class ExpenseTagAssignment(models.Model):
    """
    Many-to-many relationship between expenses and tags
    """
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE, related_name='tag_assignments')
    tag = models.ForeignKey(ExpenseTag, on_delete=models.CASCADE, related_name='expense_assignments')
    assigned_by = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    assigned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'expense_tag_assignments'
        verbose_name = 'Expense Tag Assignment'
        verbose_name_plural = 'Expense Tag Assignments'
        unique_together = ['expense', 'tag']
    
    def __str__(self):
        return f"{self.expense.id} - {self.tag.name}"


class ExpenseTemplate(models.Model):
    """
    Recurring expense templates for common expenses
    """
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='expense_templates')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.ForeignKey('companies.ExpenseCategory', on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    merchant = models.CharField(max_length=200, blank=True)
    project_code = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'expense_templates'
        verbose_name = 'Expense Template'
        verbose_name_plural = 'Expense Templates'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - {self.company.name}"
