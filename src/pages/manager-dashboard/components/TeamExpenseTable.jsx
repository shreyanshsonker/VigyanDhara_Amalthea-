import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TeamExpenseTable = ({ expenses, onViewDetails, onBulkAction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('submittedDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const employeeOptions = [
    { value: 'all', label: 'All Employees' },
    ...Array.from(new Set(expenses.map(e => e.employeeName)))?.map(name => ({
      value: name,
      label: name
    }))
  ];

  const sortOptions = [
    { value: 'submittedDate', label: 'Date Submitted' },
    { value: 'amount', label: 'Amount' },
    { value: 'employeeName', label: 'Employee' },
    { value: 'category', label: 'Category' }
  ];

  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = expenses?.filter(expense => {
      const matchesSearch = expense?.employeeName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           expense?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           expense?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesStatus = statusFilter === 'all' || expense?.status === statusFilter;
      const matchesEmployee = employeeFilter === 'all' || expense?.employeeName === employeeFilter;
      
      return matchesSearch && matchesStatus && matchesEmployee;
    });

    filtered?.sort((a, b) => {
      let aValue = a?.[sortBy];
      let bValue = b?.[sortBy];
      
      if (sortBy === 'amount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (sortBy === 'submittedDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [expenses, searchTerm, statusFilter, employeeFilter, sortBy, sortOrder]);

  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedExpenses?.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedExpenses, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedExpenses?.length / itemsPerPage);

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

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-warning/10 text-warning border-warning/20',
      approved: 'bg-success/10 text-success border-success/20',
      rejected: 'bg-error/10 text-error border-error/20'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${badges?.[status]}`}>
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedExpenses(paginatedExpenses?.map(e => e?.id));
    } else {
      setSelectedExpenses([]);
    }
  };

  const handleSelectExpense = (expenseId, checked) => {
    if (checked) {
      setSelectedExpenses([...selectedExpenses, expenseId]);
    } else {
      setSelectedExpenses(selectedExpenses?.filter(id => id !== expenseId));
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return 'ArrowUpDown';
    return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-card-foreground">Team Expenses</h2>
          {selectedExpenses?.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedExpenses?.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('approve', selectedExpenses)}
                iconName="Check"
                iconPosition="left"
              >
                Bulk Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('reject', selectedExpenses)}
                iconName="X"
                iconPosition="left"
                className="text-error border-error hover:bg-error hover:text-white"
              >
                Bulk Reject
              </Button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            type="search"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full"
          />
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
          />
          <Select
            options={employeeOptions}
            value={employeeFilter}
            onChange={setEmployeeFilter}
            placeholder="Filter by employee"
          />
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
          />
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedExpenses?.length === paginatedExpenses?.length && paginatedExpenses?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                  className="rounded border-border"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('employeeName')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Employee</span>
                  <Icon name={getSortIcon('employeeName')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Amount</span>
                  <Icon name={getSortIcon('amount')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <button
                  onClick={() => handleSort('submittedDate')}
                  className="flex items-center space-x-1 hover:text-foreground"
                >
                  <span>Date</span>
                  <Icon name={getSortIcon('submittedDate')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedExpenses?.map((expense) => (
              <tr key={expense?.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedExpenses?.includes(expense?.id)}
                    onChange={(e) => handleSelectExpense(expense?.id, e?.target?.checked)}
                    className="rounded border-border"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-muted-foreground">
                        {expense?.employeeName?.split(' ')?.map(n => n?.[0])?.join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{expense?.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{expense?.department}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-card-foreground">
                    {formatCurrency(expense?.amount, expense?.currency)}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-card-foreground">{expense?.category}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-card-foreground">{formatDate(expense?.submittedDate)}</p>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(expense?.status)}
                </td>
                <td className="px-6 py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(expense)}
                    iconName="Eye"
                    iconPosition="left"
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedExpenses?.length)} of {filteredAndSortedExpenses?.length} results
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                iconName="ChevronLeft"
              />
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                iconName="ChevronRight"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamExpenseTable;