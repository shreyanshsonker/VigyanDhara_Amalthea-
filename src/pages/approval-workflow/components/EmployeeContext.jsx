import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const EmployeeContext = ({ employee, expenseHistory, spendingPatterns }) => {
  const [showFullHistory, setShowFullHistory] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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

  const calculateTotalSpent = () => {
    return expenseHistory?.filter(expense => expense?.status === 'approved')?.reduce((total, expense) => total + expense?.amount, 0);
  };

  const getApprovalRate = () => {
    const total = expenseHistory?.length;
    const approved = expenseHistory?.filter(expense => expense?.status === 'approved')?.length;
    return total > 0 ? Math.round((approved / total) * 100) : 0;
  };

  const displayHistory = showFullHistory ? expenseHistory : expenseHistory?.slice(0, 5);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-6">Employee Context</h3>
      {/* Employee Profile */}
      <div className="flex items-center space-x-4 mb-6 p-4 bg-muted/50 rounded-lg">
        <Image
          src={employee?.avatar}
          alt={employee?.name}
          className="w-16 h-16 rounded-full"
        />
        <div className="flex-1">
          <h4 className="text-lg font-medium text-card-foreground">{employee?.name}</h4>
          <p className="text-sm text-muted-foreground">{employee?.role}</p>
          <p className="text-sm text-muted-foreground">{employee?.department}</p>
          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
            <span>Employee ID: {employee?.id}</span>
            <span>Joined: {formatDate(employee?.joinDate)}</span>
          </div>
        </div>
      </div>
      {/* Spending Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-primary/5 rounded-lg">
          <div className="text-2xl font-bold text-primary">{formatCurrency(calculateTotalSpent())}</div>
          <div className="text-xs text-muted-foreground">Total Approved</div>
        </div>
        <div className="text-center p-3 bg-accent/5 rounded-lg">
          <div className="text-2xl font-bold text-accent">{expenseHistory?.length}</div>
          <div className="text-xs text-muted-foreground">Total Expenses</div>
        </div>
        <div className="text-center p-3 bg-success/5 rounded-lg">
          <div className="text-2xl font-bold text-success">{getApprovalRate()}%</div>
          <div className="text-xs text-muted-foreground">Approval Rate</div>
        </div>
        <div className="text-center p-3 bg-warning/5 rounded-lg">
          <div className="text-2xl font-bold text-warning">
            {formatCurrency(spendingPatterns?.monthlyAverage)}
          </div>
          <div className="text-xs text-muted-foreground">Monthly Avg</div>
        </div>
      </div>
      {/* Spending Patterns */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-card-foreground mb-3">Spending Patterns</h4>
        <div className="space-y-3">
          {spendingPatterns?.categories?.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category?.color }} />
                <span className="text-sm text-card-foreground">{category?.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-card-foreground">
                  {formatCurrency(category?.amount)}
                </div>
                <div className="text-xs text-muted-foreground">{category?.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Expense History */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-card-foreground">Recent Expenses</h4>
          {expenseHistory?.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullHistory(!showFullHistory)}
              iconName={showFullHistory ? "ChevronUp" : "ChevronDown"}
              iconPosition="right"
            >
              {showFullHistory ? 'Show Less' : `Show All (${expenseHistory?.length})`}
            </Button>
          )}
        </div>
        
        <div className="space-y-2">
          {displayHistory?.map((expense, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-card-foreground">
                    {formatCurrency(expense?.amount)}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(expense?.status)}`}>
                    {expense?.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">{expense?.category}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(expense?.date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Risk Indicators */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-card-foreground mb-3">Risk Assessment</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-success/5 rounded">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm text-success">High approval rate</span>
            </div>
            <span className="text-xs text-success">Low Risk</span>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-primary/5 rounded">
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} className="text-primary" />
              <span className="text-sm text-primary">Consistent spending pattern</span>
            </div>
            <span className="text-xs text-primary">Normal</span>
          </div>
          
          {spendingPatterns?.monthlyAverage > 2000 && (
            <div className="flex items-center justify-between p-2 bg-warning/5 rounded">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                <span className="text-sm text-warning">Above average spending</span>
              </div>
              <span className="text-xs text-warning">Monitor</span>
            </div>
          )}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-card-foreground mb-3">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="User"
            iconPosition="left"
            onClick={() => console.log('View full profile')}
          >
            Full Profile
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="BarChart3"
            iconPosition="left"
            onClick={() => console.log('View analytics')}
          >
            Analytics
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="MessageCircle"
            iconPosition="left"
            onClick={() => console.log('Contact employee')}
          >
            Contact
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeContext;