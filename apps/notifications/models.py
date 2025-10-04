from django.db import models
from django.utils import timezone


class Notification(models.Model):
    """
    System notifications for users
    """
    NOTIFICATION_TYPES = [
        ('expense_submitted', 'Expense Submitted'),
        ('expense_approved', 'Expense Approved'),
        ('expense_rejected', 'Expense Rejected'),
        ('expense_escalated', 'Expense Escalated'),
        ('approval_required', 'Approval Required'),
        ('approval_overdue', 'Approval Overdue'),
        ('comment_added', 'Comment Added'),
        ('bulk_approval', 'Bulk Approval'),
        ('system', 'System Notification'),
        ('reminder', 'Reminder'),
    ]
    
    PRIORITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    # Basic Information
    recipient = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES)
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='medium')
    
    # Content
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    
    # Related objects
    expense = models.ForeignKey(
        'expenses.Expense',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications'
    )
    approval_workflow = models.ForeignKey(
        'approvals.ApprovalWorkflow',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications'
    )
    
    # Action data
    action_url = models.URLField(blank=True)
    action_text = models.CharField(max_length=100, blank=True)
    
    # Delivery settings
    send_email = models.BooleanField(default=True)
    send_sms = models.BooleanField(default=False)
    send_push = models.BooleanField(default=True)
    
    # Delivery status
    email_sent = models.BooleanField(default=False)
    sms_sent = models.BooleanField(default=False)
    push_sent = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'notifications'
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
            models.Index(fields=['notification_type']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.recipient.full_name}"
    
    def mark_as_read(self):
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])
    
    def is_expired(self):
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False


class NotificationTemplate(models.Model):
    """
    Templates for different types of notifications
    """
    name = models.CharField(max_length=100, unique=True)
    notification_type = models.CharField(max_length=30, choices=Notification.NOTIFICATION_TYPES)
    title_template = models.CharField(max_length=200)
    message_template = models.TextField()
    
    # Email settings
    email_subject = models.CharField(max_length=200, blank=True)
    email_template = models.TextField(blank=True)
    
    # SMS settings
    sms_template = models.CharField(max_length=160, blank=True)
    
    # Push notification settings
    push_title = models.CharField(max_length=100, blank=True)
    push_body = models.CharField(max_length=200, blank=True)
    
    # Default settings
    default_priority = models.CharField(max_length=10, choices=Notification.PRIORITY_LEVELS, default='medium')
    send_email = models.BooleanField(default=True)
    send_sms = models.BooleanField(default=False)
    send_push = models.BooleanField(default=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notification_templates'
        verbose_name = 'Notification Template'
        verbose_name_plural = 'Notification Templates'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class NotificationPreference(models.Model):
    """
    User notification preferences
    """
    user = models.OneToOneField('accounts.User', on_delete=models.CASCADE, related_name='notification_preferences')
    
    # Global settings
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    push_notifications = models.BooleanField(default=True)
    
    # Specific notification types
    expense_submitted_email = models.BooleanField(default=True)
    expense_approved_email = models.BooleanField(default=True)
    expense_rejected_email = models.BooleanField(default=True)
    approval_required_email = models.BooleanField(default=True)
    approval_overdue_email = models.BooleanField(default=True)
    comment_added_email = models.BooleanField(default=True)
    system_notifications_email = models.BooleanField(default=True)
    
    expense_submitted_push = models.BooleanField(default=True)
    expense_approved_push = models.BooleanField(default=True)
    expense_rejected_push = models.BooleanField(default=True)
    approval_required_push = models.BooleanField(default=True)
    approval_overdue_push = models.BooleanField(default=True)
    comment_added_push = models.BooleanField(default=True)
    system_notifications_push = models.BooleanField(default=True)
    
    # Frequency settings
    digest_frequency = models.CharField(
        max_length=20,
        choices=[
            ('immediate', 'Immediate'),
            ('hourly', 'Hourly'),
            ('daily', 'Daily'),
            ('weekly', 'Weekly'),
        ],
        default='immediate'
    )
    digest_time = models.TimeField(null=True, blank=True)  # For daily/weekly digests
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'notification_preferences'
        verbose_name = 'Notification Preference'
        verbose_name_plural = 'Notification Preferences'
    
    def __str__(self):
        return f"Notification preferences for {self.user.full_name}"


class NotificationDeliveryLog(models.Model):
    """
    Log of notification delivery attempts
    """
    DELIVERY_METHODS = [
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('push', 'Push Notification'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('failed', 'Failed'),
        ('bounced', 'Bounced'),
    ]
    
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE, related_name='delivery_logs')
    delivery_method = models.CharField(max_length=10, choices=DELIVERY_METHODS)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Delivery details
    external_id = models.CharField(max_length=200, blank=True)  # ID from email/SMS service
    error_message = models.TextField(blank=True)
    retry_count = models.PositiveIntegerField(default=0)
    
    # Timestamps
    sent_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notification_delivery_logs'
        verbose_name = 'Notification Delivery Log'
        verbose_name_plural = 'Notification Delivery Logs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.notification.title} - {self.delivery_method} - {self.status}"


class NotificationDigest(models.Model):
    """
    Digest notifications for users who prefer batched notifications
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
    ]
    
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='notification_digests')
    digest_type = models.CharField(max_length=20, choices=[
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Content
    notifications = models.ManyToManyField(Notification, related_name='digests')
    subject = models.CharField(max_length=200)
    content = models.TextField()
    
    # Delivery
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notification_digests'
        verbose_name = 'Notification Digest'
        verbose_name_plural = 'Notification Digests'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.digest_type} digest for {self.user.full_name}"
