import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PersonalAnalytics = ({ expenses }) => {
  const [timeRange, setTimeRange] = useState('month');

  const getFilteredExpenses = () => {
    const now = new Date();
    const filterDate = new Date();
    
    switch (timeRange) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return expenses;
    }
    
    return expenses.filter(expense => new Date(expense.date) >= filterDate);
  };

  const filteredExpenses = getFilteredExpenses();

  const getTotalAmount = () => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getAverageAmount = () => {
    return filteredExpenses.length > 0 ? getTotalAmount() / filteredExpenses.length : 0;
  };

  const getExpensesByCategory = () => {
    const categoryTotals = {};
    filteredExpenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  const getExpensesByStatus = () => {
    const statusCounts = {
      pending: 0,
      approved: 0,
      rejected: 0
    };
    
    filteredExpenses.forEach(expense => {
      statusCounts[expense.status]++;
    });
    
    return statusCounts;
  };

  const getMonthlyTrends = () => {
    const monthlyData = {};
    filteredExpenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      monthlyData[month] = (monthlyData[month] || 0) + expense.amount;
    });
    
    return Object.entries(monthlyData)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-warning';
      case 'approved':
        return 'text-success';
      case 'rejected':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10';
      case 'approved':
        return 'bg-success/10';
      case 'rejected':
        return 'bg-error/10';
      default:
        return 'bg-muted/10';
    }
  };

  const categoryData = getExpensesByCategory();
  const statusData = getExpensesByStatus();
  const monthlyData = getMonthlyTrends();
  const totalAmount = getTotalAmount();
  const averageAmount = getAverageAmount();

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-foreground">Personal Analytics</h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-border rounded-md text-sm bg-background"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
        <p className="text-muted-foreground">
          Insights into your spending patterns and expense trends.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-foreground">{filteredExpenses.length}</p>
            </div>
            <Icon name="FileText" size={24} className="text-primary" />
          </div>
        </div>
        
        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalAmount)}</p>
            </div>
            <Icon name="DollarSign" size={24} className="text-primary" />
          </div>
        </div>
        
        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Amount</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(averageAmount)}</p>
            </div>
            <Icon name="TrendingUp" size={24} className="text-primary" />
          </div>
        </div>
        
        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Approval Rate</p>
              <p className="text-2xl font-bold text-foreground">
                {filteredExpenses.length > 0 
                  ? `${((statusData.approved / filteredExpenses.length) * 100).toFixed(1)}%`
                  : '0%'
                }
              </p>
            </div>
            <Icon name="CheckCircle" size={24} className="text-success" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Expenses by Category</h3>
          {categoryData.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="PieChart" size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No expenses in this period</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categoryData.map((item, index) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon name={getCategoryIcon(item.category)} size={16} className="text-muted-foreground" />
                    <span className="font-medium text-foreground capitalize">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">{formatCurrency(item.amount)}</div>
                    <div className="text-xs text-muted-foreground">
                      {((item.amount / totalAmount) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expenses by Status */}
        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Expenses by Status</h3>
          <div className="space-y-4">
            {Object.entries(statusData).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusBgColor(status)}`} />
                  <span className="font-medium text-foreground capitalize">{status}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">{count}</div>
                  <div className="text-xs text-muted-foreground">
                    {filteredExpenses.length > 0 
                      ? `${((count / filteredExpenses.length) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      {monthlyData.length > 0 && (
        <div className="mt-6 bg-background border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Trends</h3>
          <div className="space-y-4">
            {monthlyData.map((item, index) => (
              <div key={item.month} className="flex items-center justify-between">
                <span className="font-medium text-foreground">{item.month}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(item.amount / Math.max(...monthlyData.map(d => d.amount))) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="font-semibold text-foreground w-20 text-right">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="mt-6 bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Spending Insights</h3>
        <div className="space-y-3">
          {categoryData.length > 0 && (
            <div className="flex items-start space-x-3">
              <Icon name="Lightbulb" size={16} className="text-primary mt-1" />
              <div>
                <p className="text-sm text-foreground">
                  Your highest spending category is <strong>{categoryData[0].category}</strong> with {formatCurrency(categoryData[0].amount)}.
                </p>
              </div>
            </div>
          )}
          
          {averageAmount > 0 && (
            <div className="flex items-start space-x-3">
              <Icon name="TrendingUp" size={16} className="text-primary mt-1" />
              <div>
                <p className="text-sm text-foreground">
                  Your average expense amount is {formatCurrency(averageAmount)} per submission.
                </p>
              </div>
            </div>
          )}
          
          {statusData.approved > 0 && (
            <div className="flex items-start space-x-3">
              <Icon name="CheckCircle" size={16} className="text-success mt-1" />
              <div>
                <p className="text-sm text-foreground">
                  You have {statusData.approved} approved expenses worth {formatCurrency(
                    filteredExpenses
                      .filter(e => e.status === 'approved')
                      .reduce((sum, e) => sum + e.amount, 0)
                  )}.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalAnalytics;
