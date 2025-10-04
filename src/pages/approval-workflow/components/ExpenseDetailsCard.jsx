import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ExpenseDetailsCard = ({ expense, onImageZoom }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    })?.format(amount);
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Travel': 'Plane',
      'Meals': 'Utensils',
      'Office Supplies': 'Package',
      'Transportation': 'Car',
      'Accommodation': 'Building',
      'Entertainment': 'Music',
      'Other': 'FileText'
    };
    return icons?.[category] || 'FileText';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-success bg-success/10';
      case 'rejected':
        return 'text-error bg-error/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={getCategoryIcon(expense?.category)} size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">
              {formatCurrency(expense?.amount, expense?.currency)}
            </h2>
            <p className="text-muted-foreground">{expense?.category}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(expense?.status)}`}>
          {expense?.status?.charAt(0)?.toUpperCase() + expense?.status?.slice(1)}
        </div>
      </div>
      {/* Expense Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <p className="text-card-foreground mt-1">{expense?.description}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Date</label>
            <p className="text-card-foreground mt-1">{formatDate(expense?.date)}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Submitted By</label>
            <div className="flex items-center space-x-2 mt-1">
              <Image
                src={expense?.employee?.avatar}
                alt={expense?.employee?.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-card-foreground font-medium">{expense?.employee?.name}</p>
                <p className="text-xs text-muted-foreground">{expense?.employee?.department}</p>
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Submission Date</label>
            <p className="text-card-foreground mt-1">{formatDate(expense?.submittedAt)}</p>
          </div>
        </div>

        {/* Receipt Preview */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Receipt</label>
            {expense?.receipt ? (
              <div className="mt-2">
                <div 
                  className="relative bg-muted rounded-lg overflow-hidden cursor-pointer hover-scale transition-transform duration-200"
                  onClick={() => onImageZoom(expense?.receipt)}
                >
                  <Image
                    src={expense?.receipt}
                    alt="Expense receipt"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <Icon name="ZoomIn" size={20} className="text-foreground" />
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onImageZoom(expense?.receipt)}
                  iconName="ZoomIn"
                  iconPosition="left"
                  className="mt-2"
                >
                  View Full Size
                </Button>
              </div>
            ) : (
              <div className="mt-2 bg-muted rounded-lg p-8 text-center">
                <Icon name="FileX" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No receipt attached</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Additional Details (Expandable) */}
      <div className="border-t border-border pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          className="mb-4"
        >
          {isExpanded ? 'Hide' : 'Show'} Additional Details
        </Button>
        
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="font-medium text-muted-foreground">Expense ID</label>
              <p className="text-card-foreground mt-1 font-mono">{expense?.id}</p>
            </div>
            <div>
              <label className="font-medium text-muted-foreground">Payment Method</label>
              <p className="text-card-foreground mt-1">{expense?.paymentMethod || 'Corporate Card'}</p>
            </div>
            <div>
              <label className="font-medium text-muted-foreground">Project Code</label>
              <p className="text-card-foreground mt-1">{expense?.projectCode || 'N/A'}</p>
            </div>
            <div>
              <label className="font-medium text-muted-foreground">Location</label>
              <p className="text-card-foreground mt-1">{expense?.location || 'Not specified'}</p>
            </div>
            <div>
              <label className="font-medium text-muted-foreground">Merchant</label>
              <p className="text-card-foreground mt-1">{expense?.merchant || 'Not specified'}</p>
            </div>
            <div>
              <label className="font-medium text-muted-foreground">Tax Amount</label>
              <p className="text-card-foreground mt-1">{expense?.taxAmount ? formatCurrency(expense?.taxAmount, expense?.currency) : 'N/A'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseDetailsCard;