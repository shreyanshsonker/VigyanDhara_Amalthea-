import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const FilterControls = ({ 
  filters, 
  onFilterChange, 
  onApplyFilters, 
  onResetFilters,
  userRole = 'admin' 
}) => {
  const dateRangeOptions = [
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last3months', label: 'Last 3 Months' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'lastyear', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'travel', label: 'Travel' },
    { value: 'meals', label: 'Meals & Entertainment' },
    { value: 'office', label: 'Office Supplies' },
    { value: 'software', label: 'Software & Tools' },
    { value: 'training', label: 'Training & Development' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Filters & Controls</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onApplyFilters}
            iconName="Filter"
            iconPosition="left"
          >
            Apply Filters
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Date Range"
          options={dateRangeOptions}
          value={filters?.dateRange}
          onChange={(value) => onFilterChange('dateRange', value)}
          placeholder="Select date range"
        />

        {userRole === 'admin' && (
          <Select
            label="Department"
            options={departmentOptions}
            value={filters?.department}
            onChange={(value) => onFilterChange('department', value)}
            placeholder="Select department"
          />
        )}

        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
          placeholder="Select status"
        />

        <Select
          label="Category"
          options={categoryOptions}
          value={filters?.category}
          onChange={(value) => onFilterChange('category', value)}
          placeholder="Select category"
        />
      </div>
      {filters?.dateRange === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input
            label="Start Date"
            type="date"
            value={filters?.startDate}
            onChange={(e) => onFilterChange('startDate', e?.target?.value)}
          />
          <Input
            label="End Date"
            type="date"
            value={filters?.endDate}
            onChange={(e) => onFilterChange('endDate', e?.target?.value)}
          />
        </div>
      )}
    </div>
  );
};

export default FilterControls;