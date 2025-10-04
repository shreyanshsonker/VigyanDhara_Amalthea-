from django.db import models
from django.utils import timezone
from datetime import timedelta


class ApprovalWorkflow(models.Model):
    """
    Approval workflow steps for expenses
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('escalated', 'Escalated'),
        ('cancelled', 'Cancelled'),
    ]
    
    expense = models.ForeignKey('expenses.Expense', on_delete=models.CASCADE, related_name='approval_workflow')
    approver = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='approval_workflows')
    step_order = models.PositiveIntegerField()  # Order in the approval chain
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Approval details
    approved_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)
    comments = models.TextField(blank=True)
    rejection_reason = models.TextField(blank=True)
    
    # Escalation
    escalated_at = models.DateTimeField(null=True, blank=True)
    escalated_to = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='escalated_approvals'
    )
    
    # Due dates
    due_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'approval_workflows'
        verbose_name = 'Approval Workflow'
        verbose_name_plural = 'Approval Workflows'
        ordering = ['step_order']
        unique_together = ['expense', 'step_order']
    
    def __str__(self):
        return f"{self.expense.id} - Step {self.step_order} - {self.approver.full_name}"
    
    def is_overdue(self):
        return self.status == 'pending' and timezone.now() > self.due_date
    
    def can_escalate(self):
        return self.status == 'pending' and timezone.now() > self.due_date




class ApprovalHistory(models.Model):
    """
    Historical record of all approval actions
    """
    ACTION_TYPES = [
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('escalated', 'Escalated'),
        ('cancelled', 'Cancelled'),
        ('reopened', 'Reopened'),
        ('commented', 'Commented'),
    ]
    
    expense = models.ForeignKey('expenses.Expense', on_delete=models.CASCADE, related_name='approval_history')
    action_type = models.CharField(max_length=20, choices=ACTION_TYPES)
    performed_by = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='approval_actions')
    comments = models.TextField(blank=True)
    old_status = models.CharField(max_length=20, blank=True)
    new_status = models.CharField(max_length=20, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # Additional data
    metadata = models.JSONField(default=dict, blank=True)
    
    class Meta:
        db_table = 'approval_history'
        verbose_name = 'Approval History'
        verbose_name_plural = 'Approval Histories'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.expense.id} - {self.action_type} by {self.performed_by.full_name}"


class EscalationLog(models.Model):
    """
    Log of escalation events
    """
    expense = models.ForeignKey('expenses.Expense', on_delete=models.CASCADE, related_name='escalation_logs')
    from_approver = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='escalated_from'
    )
    to_approver = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='escalated_to'
    )
    reason = models.TextField()
    escalated_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'escalation_logs'
        verbose_name = 'Escalation Log'
        verbose_name_plural = 'Escalation Logs'
        ordering = ['-escalated_at']
    
    def __str__(self):
        return f"Escalation: {self.expense.id} from {self.from_approver.full_name} to {self.to_approver.full_name}"


class ApprovalTemplate(models.Model):
    """
    Templates for common approval workflows
    """
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='approval_templates')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    # Workflow steps
    steps = models.JSONField(default=list)  # List of approval steps with approver roles
    
    created_by = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'approval_templates'
        verbose_name = 'Approval Template'
        verbose_name_plural = 'Approval Templates'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - {self.company.name}"


class BulkApproval(models.Model):
    """
    Bulk approval operations
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='bulk_approvals')
    approver = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='bulk_approvals')
    action = models.CharField(max_length=20, choices=[('approve', 'Approve'), ('reject', 'Reject')])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Expenses to process
    expense_ids = models.JSONField(default=list)
    comments = models.TextField(blank=True)
    
    # Results
    processed_count = models.PositiveIntegerField(default=0)
    success_count = models.PositiveIntegerField(default=0)
    failure_count = models.PositiveIntegerField(default=0)
    error_log = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'bulk_approvals'
        verbose_name = 'Bulk Approval'
        verbose_name_plural = 'Bulk Approvals'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Bulk {self.action} by {self.approver.full_name} - {self.status}"
