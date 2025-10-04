import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PersonalExpenseHistory = ({ expenses }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: 'Pending',
        className: 'bg-warning/10 text-warning border-warning/20',
        icon: 'Clock'
      },
      approved: {
        label: 'Approved',
        className: 'bg-success/10 text-success border-success/20',
        icon: 'CheckCircle'
      },
      rejected: {
        label: 'Rejected',
        className: 'bg-error/10 text-error border-error/20',
        icon: 'XCircle'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${config.className}`}>
        <Icon name={config.icon} size={12} />
        <span>{config.label}</span>
      </span>
    );
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

  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'all') return true;
    return expense.status === filter;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        aValue = new Date(a.submittedAt);
        bValue = new Date(b.submittedAt);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleViewReceipt = (expense) => {
    if (expense.receipt) {
      window.open(expense.receipt, '_blank');
    }
  };

  const handleEditExpense = (expense) => {
    console.log('Edit expense:', expense);
    // Implement edit functionality
  };

  const handleDeleteExpense = (expense) => {
    if (expense.status === 'pending') {
      console.log('Delete expense:', expense);
      // Implement delete functionality
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">My Expense History</h2>
        <p className="text-muted-foreground">
          View and manage all your submitted expenses.
        </p>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-foreground">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 border border-border rounded-md text-sm bg-background"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-foreground">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-border rounded-md text-sm bg-background"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="status">Status</option>
              <option value="submitted">Submitted</option>
            </select>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              iconName={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
            />
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {sortedExpenses.length} expense{sortedExpenses.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Expense List */}
      <div className="space-y-4">
        {sortedExpenses.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No expenses found</h3>
            <p className="text-muted-foreground">
              {filter === 'all' 
                ? "You haven't submitted any expenses yet."
                : `No ${filter} expenses found.`
              }
            </p>
          </div>
        ) : (
          sortedExpenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-background border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon 
                      name={getCategoryIcon(expense.category)} 
                      size={20} 
                      className="text-muted-foreground" 
                    />
                    <div>
                      <h3 className="font-medium text-foreground">{expense.description}</h3>
                      <p className="text-sm text-muted-foreground">
                        {expense.vendor && `${expense.vendor} • `}
                        {formatDate(expense.date)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="capitalize">{expense.category}</span>
                    <span>•</span>
                    <span>Submitted {formatDate(expense.submittedAt)}</span>
                    {expense.approvedAt && (
                      <>
                        <span>•</span>
                        <span>Approved {formatDate(expense.approvedAt)}</span>
                      </>
                    )}
                    {expense.rejectedAt && (
                      <>
                        <span>•</span>
                        <span>Rejected {formatDate(expense.rejectedAt)}</span>
                      </>
                    )}
                  </div>
                  
                  {expense.rejectionReason && (
                    <div className="mt-2 p-2 bg-error/10 border border-error/20 rounded text-sm text-error">
                      <strong>Rejection reason:</strong> {expense.rejectionReason}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-foreground">
                      {formatCurrency(expense.amount)}
                    </div>
                    {getStatusBadge(expense.status)}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {expense.receipt && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewReceipt(expense)}
                        iconName="Eye"
                        title="View Receipt"
                      />
                    )}
                    
                    {expense.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditExpense(expense)}
                          iconName="Edit"
                          title="Edit Expense"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteExpense(expense)}
                          iconName="Trash2"
                          title="Delete Expense"
                          className="text-error hover:text-error"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PersonalExpenseHistory;
