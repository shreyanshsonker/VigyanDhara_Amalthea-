import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PendingApprovalCard = ({ expense, onApprove, onReject, onViewDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    await onApprove(expense?.id);
    setIsProcessing(false);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await onReject(expense?.id);
    setIsProcessing(false);
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    })?.format(amount);
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-error bg-error/10 border-error/20';
      case 'medium':
        return 'text-warning bg-warning/10 border-warning/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-elevation-2 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-muted-foreground">
              {expense?.employeeName?.split(' ')?.map(n => n?.[0])?.join('')}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-card-foreground">{expense?.employeeName}</h3>
            <p className="text-sm text-muted-foreground">{expense?.department}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {expense?.priority && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(expense?.priority)}`}>
              {expense?.priority}
            </span>
          )}
          <span className="text-sm text-muted-foreground">{formatDate(expense?.submittedDate)}</span>
        </div>
      </div>
      {/* Expense Details */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={getCategoryIcon(expense?.category)} size={16} className="text-primary" />
          </div>
          <div>
            <p className="font-semibold text-lg text-card-foreground">
              {formatCurrency(expense?.amount, expense?.currency)}
            </p>
            <p className="text-sm text-muted-foreground">{expense?.category}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
        >
          Details
        </Button>
      </div>
      {/* Description */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {expense?.description}
        </p>
      </div>
      {/* Receipt Thumbnail */}
      {expense?.receiptUrl && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Paperclip" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Receipt attached</span>
          </div>
          <div className="w-20 h-20 border border-border rounded-lg overflow-hidden">
            <Image
              src={expense?.receiptUrl}
              alt="Receipt"
              className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onViewDetails(expense)}
            />
          </div>
        </div>
      )}
      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border pt-4 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Expense Date:</span>
              <p className="font-medium">{formatDate(expense?.expenseDate)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Payment Method:</span>
              <p className="font-medium">{expense?.paymentMethod}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Project:</span>
              <p className="font-medium">{expense?.project || 'N/A'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Status:</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">
                Pending Review
              </span>
            </div>
          </div>
          {expense?.notes && (
            <div>
              <span className="text-muted-foreground text-sm">Notes:</span>
              <p className="text-sm mt-1">{expense?.notes}</p>
            </div>
          )}
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(expense)}
          iconName="Eye"
          iconPosition="left"
        >
          View Full Details
        </Button>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReject}
            disabled={isProcessing}
            iconName="X"
            iconPosition="left"
            className="text-error border-error hover:bg-error hover:text-white"
          >
            Reject
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleApprove}
            loading={isProcessing}
            iconName="Check"
            iconPosition="left"
            className="bg-success hover:bg-success/90"
          >
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalCard;