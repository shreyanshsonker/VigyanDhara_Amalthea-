import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ExpenseTimelineModal = ({ expense, isOpen, onClose }) => {
  if (!isOpen || !expense) return null;

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    })?.format(amount);
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const timelineSteps = [
    {
      id: 1,
      title: 'Expense Submitted',
      description: `Submitted by ${expense?.employeeName}`,
      date: expense?.submittedDate,
      status: 'completed',
      icon: 'FileText',
      user: expense?.employeeName
    },
    {
      id: 2,
      title: 'Manager Review',
      description: 'Pending manager approval',
      date: expense?.submittedDate,
      status: expense?.status === 'pending' ? 'current' : 'completed',
      icon: 'User',
      user: 'Manager Review'
    },
    {
      id: 3,
      title: 'Finance Review',
      description: 'Awaiting finance department approval',
      date: null,
      status: expense?.status === 'approved' ? 'completed' : 'pending',
      icon: 'DollarSign',
      user: 'Finance Team'
    },
    {
      id: 4,
      title: 'Final Approval',
      description: 'Expense processing complete',
      date: expense?.status === 'approved' ? expense?.approvedDate : null,
      status: expense?.status === 'approved' ? 'completed' : 'pending',
      icon: 'CheckCircle',
      user: 'System'
    }
  ];

  const getStepIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'current':
        return 'Clock';
      default:
        return 'Circle';
    }
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success';
      case 'current':
        return 'text-warning bg-warning';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Travel': 'Plane',
      'Meals': 'Coffee',
      'Office Supplies': 'Package',
      'Transportation': 'Car',
      'Accommodation': 'Building',
      'Entertainment': 'Music',
      'Other': 'FileText'
    };
    return icons?.[category] || 'FileText';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={getCategoryIcon(expense?.category)} size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">Expense Details</h2>
              <p className="text-sm text-muted-foreground">#{expense?.id}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Expense Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Amount</label>
                <p className="text-2xl font-bold text-card-foreground">
                  {formatCurrency(expense?.amount, expense?.currency)}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Category</label>
                <p className="text-lg font-medium text-card-foreground">{expense?.category}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Employee</label>
                <p className="font-medium text-card-foreground">{expense?.employeeName}</p>
                <p className="text-sm text-muted-foreground">{expense?.department}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Expense Date</label>
                <p className="font-medium text-card-foreground">
                  {formatDate(expense?.expenseDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-muted-foreground">Description</label>
            <p className="mt-1 text-card-foreground">{expense?.description}</p>
          </div>

          {/* Receipt */}
          {expense?.receiptUrl && (
            <div>
              <label className="text-sm text-muted-foreground">Receipt</label>
              <div className="mt-2 border border-border rounded-lg overflow-hidden">
                <Image
                  src={expense?.receiptUrl}
                  alt="Expense Receipt"
                  className="w-full h-64 object-contain bg-muted"
                />
              </div>
            </div>
          )}

          {/* Additional Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Payment Method</label>
              <p className="font-medium text-card-foreground">{expense?.paymentMethod}</p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Project</label>
              <p className="font-medium text-card-foreground">{expense?.project || 'N/A'}</p>
            </div>
          </div>

          {/* Notes */}
          {expense?.notes && (
            <div>
              <label className="text-sm text-muted-foreground">Notes</label>
              <p className="mt-1 text-card-foreground">{expense?.notes}</p>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Approval Timeline</h3>
            <div className="space-y-4">
              {timelineSteps?.map((step, index) => (
                <div key={step?.id} className="flex items-start space-x-4">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepColor(step?.status)}`}>
                      <Icon 
                        name={getStepIcon(step?.status)} 
                        size={20} 
                        color={step?.status === 'pending' ? 'currentColor' : 'white'} 
                      />
                    </div>
                    {index < timelineSteps?.length - 1 && (
                      <div className="absolute top-10 left-5 w-px h-8 bg-border" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-card-foreground">{step?.title}</h4>
                      {step?.date && (
                        <span className="text-xs text-muted-foreground">
                          {formatDate(step?.date)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{step?.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">by {step?.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {expense?.status === 'pending' && (
            <>
              <Button
                variant="outline"
                iconName="X"
                iconPosition="left"
                className="text-error border-error hover:bg-error hover:text-white"
              >
                Reject
              </Button>
              <Button
                variant="default"
                iconName="Check"
                iconPosition="left"
                className="bg-success hover:bg-success/90"
              >
                Approve
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseTimelineModal;