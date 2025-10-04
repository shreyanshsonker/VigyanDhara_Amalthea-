import React from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/CheckBox';
import Icon from '../../../components/AppIcon';

const ConfigurationSection = ({ formData, errors, onInputChange, onCheckboxChange }) => {
  const timezoneOptions = [
    { value: 'UTC-12:00', label: '(UTC-12:00) International Date Line West' },
    { value: 'UTC-11:00', label: '(UTC-11:00) Coordinated Universal Time-11' },
    { value: 'UTC-10:00', label: '(UTC-10:00) Hawaii' },
    { value: 'UTC-09:00', label: '(UTC-09:00) Alaska' },
    { value: 'UTC-08:00', label: '(UTC-08:00) Pacific Time (US & Canada)' },
    { value: 'UTC-07:00', label: '(UTC-07:00) Mountain Time (US & Canada)' },
    { value: 'UTC-06:00', label: '(UTC-06:00) Central Time (US & Canada)' },
    { value: 'UTC-05:00', label: '(UTC-05:00) Eastern Time (US & Canada)' },
    { value: 'UTC-04:00', label: '(UTC-04:00) Atlantic Time (Canada)' },
    { value: 'UTC-03:00', label: '(UTC-03:00) Brasilia' },
    { value: 'UTC-02:00', label: '(UTC-02:00) Coordinated Universal Time-02' },
    { value: 'UTC-01:00', label: '(UTC-01:00) Azores' },
    { value: 'UTC+00:00', label: '(UTC+00:00) London, Dublin, Edinburgh' },
    { value: 'UTC+01:00', label: '(UTC+01:00) Berlin, Madrid, Paris' },
    { value: 'UTC+02:00', label: '(UTC+02:00) Cairo, Helsinki, Athens' },
    { value: 'UTC+03:00', label: '(UTC+03:00) Moscow, Kuwait, Riyadh' },
    { value: 'UTC+04:00', label: '(UTC+04:00) Abu Dhabi, Muscat' },
    { value: 'UTC+05:00', label: '(UTC+05:00) Islamabad, Karachi' },
    { value: 'UTC+05:30', label: '(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi' },
    { value: 'UTC+06:00', label: '(UTC+06:00) Dhaka, Almaty' },
    { value: 'UTC+07:00', label: '(UTC+07:00) Bangkok, Hanoi, Jakarta' },
    { value: 'UTC+08:00', label: '(UTC+08:00) Beijing, Hong Kong, Singapore' },
    { value: 'UTC+09:00', label: '(UTC+09:00) Tokyo, Seoul, Osaka' },
    { value: 'UTC+10:00', label: '(UTC+10:00) Sydney, Melbourne' },
    { value: 'UTC+11:00', label: '(UTC+11:00) Solomon Islands' },
    { value: 'UTC+12:00', label: '(UTC+12:00) Auckland, Wellington' }
  ];

  const approvalWorkflowOptions = [
    { value: 'simple', label: 'Simple Approval', description: 'Manager approval only' },
    { value: 'two-tier', label: 'Two-Tier Approval', description: 'Manager → Finance approval' },
    { value: 'three-tier', label: 'Three-Tier Approval', description: 'Manager → Finance → Director approval' },
    { value: 'custom', label: 'Custom Workflow', description: 'Configure later in settings' }
  ];

  const expenseCategoryOptions = [
    { value: 'travel', label: 'Travel & Transportation' },
    { value: 'meals', label: 'Meals & Entertainment' },
    { value: 'office', label: 'Office Supplies' },
    { value: 'software', label: 'Software & Subscriptions' },
    { value: 'marketing', label: 'Marketing & Advertising' },
    { value: 'training', label: 'Training & Development' },
    { value: 'utilities', label: 'Utilities & Communications' },
    { value: 'other', label: 'Other Business Expenses' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Initial Configuration</h2>
        <p className="text-muted-foreground">Set up your expense management preferences</p>
      </div>
      <div className="space-y-6">
        <Select
          label="Timezone"
          placeholder="Select your timezone"
          options={timezoneOptions}
          value={formData?.timezone}
          onChange={(value) => onInputChange({ target: { name: 'timezone', value } })}
          error={errors?.timezone}
          required
          searchable
          description="This affects expense timestamps and reporting schedules"
          className="mt-4"
        />

        <Select
          label="Default Approval Workflow"
          placeholder="Choose approval process"
          options={approvalWorkflowOptions}
          value={formData?.approvalWorkflow}
          onChange={(value) => onInputChange({ target: { name: 'approvalWorkflow', value } })}
          error={errors?.approvalWorkflow}
          required
          description="You can customize this later in settings"
          className="mt-4"
        />

        <div className="space-y-4">
          <label className="text-sm font-medium text-foreground">
            Default Expense Categories
            <span className="text-error ml-1">*</span>
          </label>
          <p className="text-xs text-muted-foreground -mt-2">
            Select categories that your employees will commonly use
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-muted rounded-lg border border-border">
            {expenseCategoryOptions?.map((category) => (
              <Checkbox
                key={category?.value}
                label={category?.label}
                checked={formData?.expenseCategories?.includes(category?.value)}
                onChange={(e) => onCheckboxChange('expenseCategories', category?.value, e?.target?.checked)}
              />
            ))}
          </div>
          {errors?.expenseCategories && (
            <p className="text-sm text-error">{errors?.expenseCategories}</p>
          )}
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={20} className="text-primary mt-1" />
            <div className="space-y-3">
              <h3 className="font-medium text-card-foreground">Security & Compliance</h3>
              
              <Checkbox
                label="Enable two-factor authentication for admin accounts"
                description="Recommended for enhanced security"
                checked={formData?.enableTwoFactor}
                onChange={(e) => onCheckboxChange('enableTwoFactor', null, e?.target?.checked)}
              />

              <Checkbox
                label="Require receipt uploads for all expenses"
                description="Mandatory documentation for compliance"
                checked={formData?.requireReceipts}
                onChange={(e) => onCheckboxChange('requireReceipts', null, e?.target?.checked)}
              />

              <Checkbox
                label="Enable OCR auto-fill for receipt processing"
                description="Automatically extract expense details from receipts"
                checked={formData?.enableOCR}
                onChange={(e) => onCheckboxChange('enableOCR', null, e?.target?.checked)}
              />

              <Checkbox
                label="Send email notifications for approvals"
                description="Keep users informed about expense status changes"
                checked={formData?.emailNotifications}
                onChange={(e) => onCheckboxChange('emailNotifications', null, e?.target?.checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationSection;