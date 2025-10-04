import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ApprovalJourneyTimeline = ({ expenses }) => {
  const [selectedExpense, setSelectedExpense] = useState(null);

  const getTimelineEvents = (expense) => {
    const events = [
      {
        id: 'submitted',
        title: 'Expense Submitted',
        description: `Submitted for ${expense.category} expense`,
        timestamp: expense.submittedAt,
        status: 'completed',
        icon: 'Send'
      }
    ];

    if (expense.status === 'approved') {
      events.push({
        id: 'approved',
        title: 'Expense Approved',
        description: `Approved by ${expense.approvedBy}`,
        timestamp: expense.approvedAt,
        status: 'completed',
        icon: 'CheckCircle'
      });
    } else if (expense.status === 'rejected') {
      events.push({
        id: 'rejected',
        title: 'Expense Rejected',
        description: `Rejected by ${expense.rejectedBy}`,
        timestamp: expense.rejectedAt,
        status: 'rejected',
        icon: 'XCircle'
      });
    } else {
      events.push({
        id: 'pending',
        title: 'Under Review',
        description: 'Awaiting manager approval',
        timestamp: null,
        status: 'pending',
        icon: 'Clock'
      });
    }

    return events;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'rejected':
        return 'text-error';
      case 'pending':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 border-success/20';
      case 'rejected':
        return 'bg-error/10 border-error/20';
      case 'pending':
        return 'bg-warning/10 border-warning/20';
      default:
        return 'bg-muted/10 border-muted/20';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      meals: 'Utensils',
      travel: 'Car',
      office: 'Briefcase',
      software: 'Monitor',
      training: 'BookOpen',
      communication: 'Phone',
      other: 'Package'
    };
    
    return categoryIcons[category] || 'Package';
  };

  const pendingExpenses = expenses.filter(e => e.status === 'pending');
  const processedExpenses = expenses.filter(e => e.status !== 'pending');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Approval Journey</h2>
        <p className="text-muted-foreground">
          Track the progress of your expense submissions through the approval process.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Expenses */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Clock" size={20} className="text-warning" />
            <span>Pending Approval ({pendingExpenses.length})</span>
          </h3>
          
          <div className="space-y-4">
            {pendingExpenses.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="CheckCircle" size={32} className="text-success mx-auto mb-2" />
                <p className="text-muted-foreground">No pending expenses</p>
              </div>
            ) : (
              pendingExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-background border border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setSelectedExpense(expense)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon name={getCategoryIcon(expense.category)} size={16} className="text-muted-foreground" />
                      <span className="font-medium text-foreground">{expense.description}</span>
                    </div>
                    <span className="text-lg font-semibold text-foreground">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Submitted {formatDate(expense.submittedAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Processed Expenses */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="FileText" size={20} className="text-primary" />
            <span>Processed ({processedExpenses.length})</span>
          </h3>
          
          <div className="space-y-4">
            {processedExpenses.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="FileText" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No processed expenses</p>
              </div>
            ) : (
              processedExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-background border border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setSelectedExpense(expense)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon name={getCategoryIcon(expense.category)} size={16} className="text-muted-foreground" />
                      <span className="font-medium text-foreground">{expense.description}</span>
                    </div>
                    <span className="text-lg font-semibold text-foreground">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {expense.status === 'approved' ? 'Approved' : 'Rejected'} {formatDate(expense.approvedAt || expense.rejectedAt)}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      expense.status === 'approved' 
                        ? 'bg-success/10 text-success border border-success/20'
                        : 'bg-error/10 text-error border border-error/20'
                    }`}>
                      {expense.status === 'approved' ? 'Approved' : 'Rejected'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Expense Detail Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground">Expense Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedExpense(null)}
                  iconName="X"
                />
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Expense Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">{formatCurrency(selectedExpense.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium capitalize">{selectedExpense.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">{formatDate(selectedExpense.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vendor:</span>
                      <span className="font-medium">{selectedExpense.vendor || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedExpense.description}</p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="font-medium text-foreground mb-4">Approval Timeline</h4>
                <div className="space-y-4">
                  {getTimelineEvents(selectedExpense).map((event, index) => (
                    <div key={event.id} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${getStatusBgColor(event.status)}`}>
                        <Icon 
                          name={event.icon} 
                          size={16} 
                          className={getStatusColor(event.status)} 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-foreground">{event.title}</h5>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(event.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalJourneyTimeline;
