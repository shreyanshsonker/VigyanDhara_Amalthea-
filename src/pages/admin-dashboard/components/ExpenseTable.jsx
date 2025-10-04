import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ExpenseTable = ({ expenses, onApprove, onReject, onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'amount', label: 'Amount' },
    { value: 'employee', label: 'Employee' },
    { value: 'status', label: 'Status' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { color: 'bg-success text-success-foreground', icon: 'CheckCircle' },
      pending: { color: 'bg-warning text-warning-foreground', icon: 'Clock' },
      rejected: { color: 'bg-error text-error-foreground', icon: 'XCircle' }
    };

    const config = statusConfig?.[status] || statusConfig?.pending;

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const filteredExpenses = expenses?.filter(expense => {
      const matchesSearch = expense?.employee?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           expense?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           expense?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesStatus = statusFilter === 'all' || expense?.status === statusFilter;
      return matchesSearch && matchesStatus;
    })?.sort((a, b) => {
      let aValue = a?.[sortBy];
      let bValue = b?.[sortBy];

      if (sortBy === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortBy === 'amount') {
        aValue = parseFloat(aValue?.replace(/[$,]/g, ''));
        bValue = parseFloat(bValue?.replace(/[$,]/g, ''));
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <h3 className="text-lg font-semibold text-card-foreground">Recent Expenses</h3>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Input
              type="search"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full sm:w-64"
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-full sm:w-40"
            />
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={setSortBy}
              className="w-full sm:w-32"
            />
          </div>
        </div>
      </div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('employee')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Employee</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Amount</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">Category</th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Date</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-muted-foreground">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Status</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredExpenses?.map((expense) => (
              <tr key={expense?.id} className="hover:bg-muted/50 transition-colors duration-200">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-foreground">
                        {expense?.employee?.split(' ')?.map(n => n?.[0])?.join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{expense?.employee}</p>
                      <p className="text-sm text-muted-foreground">{expense?.department}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-mono font-medium text-card-foreground">{expense?.amount}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">{expense?.category}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">{expense?.date}</span>
                </td>
                <td className="p-4">
                  {getStatusBadge(expense?.status)}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(expense)}
                      iconName="Eye"
                    />
                    {expense?.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onApprove(expense?.id)}
                          iconName="Check"
                          className="text-success hover:text-success"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onReject(expense?.id)}
                          iconName="X"
                          className="text-error hover:text-error"
                        />
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {filteredExpenses?.map((expense) => (
          <div key={expense?.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    {expense?.employee?.split(' ')?.map(n => n?.[0])?.join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-card-foreground">{expense?.employee}</p>
                  <p className="text-sm text-muted-foreground">{expense?.department}</p>
                </div>
              </div>
              {getStatusBadge(expense?.status)}
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="font-mono font-medium text-card-foreground">{expense?.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Category:</span>
                <span className="text-sm text-card-foreground">{expense?.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Date:</span>
                <span className="text-sm text-card-foreground">{expense?.date}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(expense)}
                iconName="Eye"
                iconPosition="left"
              >
                View
              </Button>
              {expense?.status === 'pending' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onApprove(expense?.id)}
                    iconName="Check"
                    className="text-success hover:text-success"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onReject(expense?.id)}
                    iconName="X"
                    className="text-error hover:text-error"
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Empty State */}
      {filteredExpenses?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="FileX" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No expenses found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;