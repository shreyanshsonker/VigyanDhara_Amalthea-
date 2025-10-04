import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkflowHeader from '../../components/ui/WorkflowHeader';
import KPICard from './components/KPICard';
import FilterControls from './components/FilterControls';
import ExpenseChart from './components/ExpenseChart';
import DataTable from './components/DataTable';
import ExportModal from './components/ExportModal';
import Button from '../../components/ui/Button';


const AnalyticsAndReports = () => {
  const navigate = useNavigate();
  const [userRole] = useState('admin'); // This would come from auth context
  const [filters, setFilters] = useState({
    dateRange: 'last30days',
    department: 'all',
    status: 'all',
    category: 'all',
    startDate: '',
    endDate: ''
  });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Mock KPI data
  const kpiData = [
    {
      title: 'Total Expenses',
      value: '$124,580',
      change: '+12.5%',
      changeType: 'increase',
      icon: 'DollarSign',
      color: 'bg-primary'
    },
    {
      title: 'Average Amount',
      value: '$285',
      change: '-3.2%',
      changeType: 'decrease',
      icon: 'TrendingUp',
      color: 'bg-accent'
    },
    {
      title: 'Approval Rate',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'increase',
      icon: 'CheckCircle',
      color: 'bg-success'
    },
    {
      title: 'Pending Reviews',
      value: '23',
      change: '+5',
      changeType: 'increase',
      icon: 'Clock',
      color: 'bg-warning'
    }
  ];

  // Mock chart data
  const categoryData = [
    { name: 'Travel', value: 45200 },
    { name: 'Meals', value: 28400 },
    { name: 'Office Supplies', value: 18900 },
    { name: 'Software', value: 15600 },
    { name: 'Training', value: 12300 },
    { name: 'Other', value: 8100 }
  ];

  const departmentData = [
    { name: 'Sales', value: 52400 },
    { name: 'Marketing', value: 38200 },
    { name: 'Engineering', value: 29800 },
    { name: 'HR', value: 18600 },
    { name: 'Finance', value: 15200 },
    { name: 'Operations', value: 12300 }
  ];

  const trendData = [
    { name: 'Jan', value: 18500 },
    { name: 'Feb', value: 22300 },
    { name: 'Mar', value: 19800 },
    { name: 'Apr', value: 25600 },
    { name: 'May', value: 28900 },
    { name: 'Jun', value: 31200 },
    { name: 'Jul', value: 29400 },
    { name: 'Aug', value: 33100 },
    { name: 'Sep', value: 35800 },
    { name: 'Oct', value: 32600 }
  ];

  // Mock table data
  const expenseData = [
    {
      id: 'EXP-001',
      employee: 'John Smith',
      department: 'Sales',
      category: 'Travel',
      amount: 1250,
      date: '2024-10-01',
      status: 'approved',
      description: 'Client meeting in New York'
    },
    {
      id: 'EXP-002',
      employee: 'Sarah Johnson',
      department: 'Marketing',
      category: 'Meals',
      amount: 85,
      date: '2024-10-02',
      status: 'pending',
      description: 'Team lunch meeting'
    },
    {
      id: 'EXP-003',
      employee: 'Mike Davis',
      department: 'Engineering',
      category: 'Software',
      amount: 299,
      date: '2024-10-01',
      status: 'approved',
      description: 'Development tools subscription'
    },
    {
      id: 'EXP-004',
      employee: 'Lisa Chen',
      department: 'HR',
      category: 'Training',
      amount: 450,
      date: '2024-09-30',
      status: 'rejected',
      description: 'Professional development course'
    },
    {
      id: 'EXP-005',
      employee: 'David Wilson',
      department: 'Sales',
      category: 'Travel',
      amount: 890,
      date: '2024-09-29',
      status: 'approved',
      description: 'Conference attendance'
    }
  ];

  const tableColumns = [
    { key: 'id', label: 'Expense ID', sortable: true },
    { key: 'employee', label: 'Employee', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
    // Filter logic would be implemented here
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: 'last30days',
      department: 'all',
      status: 'all',
      category: 'all',
      startDate: '',
      endDate: ''
    });
  };

  const handleExport = (config) => {
    console.log('Exporting with config:', config);
    // Export logic would be implemented here
  };

  const headerActions = [
    {
      label: 'Export Report',
      icon: 'Download',
      variant: 'default',
      onClick: () => setIsExportModalOpen(true)
    },
    {
      label: 'Refresh Data',
      icon: 'RefreshCw',
      variant: 'outline',
      onClick: () => window.location?.reload()
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <WorkflowHeader
        title="Analytics & Reports"
        actions={headerActions}
        userRole={userRole}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData?.map((kpi, index) => (
            <KPICard
              key={index}
              title={kpi?.title}
              value={kpi?.value}
              change={kpi?.change}
              changeType={kpi?.changeType}
              icon={kpi?.icon}
              color={kpi?.color}
            />
          ))}
        </div>

        {/* Filter Controls */}
        <FilterControls
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          userRole={userRole}
        />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ExpenseChart
            type="pie"
            data={categoryData}
            title="Expenses by Category"
            height={350}
          />
          <ExpenseChart
            type="bar"
            data={departmentData}
            title="Expenses by Department"
            height={350}
          />
        </div>

        <div className="mb-8">
          <ExpenseChart
            type="line"
            data={trendData}
            title="Monthly Expense Trends"
            height={400}
          />
        </div>

        {/* Data Table */}
        <DataTable
          data={expenseData}
          columns={tableColumns}
          title="Recent Expenses"
          exportable={true}
        />

        {/* Quick Actions */}
        <div className="mt-8 bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/approval-workflow')}
              iconName="CheckCircle"
              iconPosition="left"
            >
              View Approvals
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsExportModalOpen(true)}
              iconName="FileText"
              iconPosition="left"
            >
              Generate Report
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/admin-dashboard')}
              iconName="Settings"
              iconPosition="left"
            >
              Dashboard Settings
            </Button>
          </div>
        </div>
      </div>
      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
};

export default AnalyticsAndReports;