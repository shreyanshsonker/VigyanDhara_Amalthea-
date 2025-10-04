import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkflowHeader from '../../components/ui/WorkflowHeader';
import NotificationBell from '../../components/ui/NotificationBell';
import AnalyticsCard from './components/AnalyticsCard';
import ExpenseChart from './components/ExpenseChart';
import ExpenseTable from './components/ExpenseTable';
import NotificationPanel from './components/NotificationPanel';
import QuickActions from './components/QuickActions';
import AddEmployeeModal from './components/AddEmployeeModal';
import Icon from '../../components/AppIcon';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  const [isNewCompany, setIsNewCompany] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);

  // Check authentication and new company status
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    
    console.log('Admin Dashboard - Auth Check:', { isAuthenticated, userRole });
    
    // Redirect to login if not authenticated or not admin
    if (isAuthenticated !== 'true' || userRole !== 'admin') {
      console.log('Redirecting to login - Auth failed');
      navigate('/login');
      return;
    }
    
    const newCompanyFlag = localStorage.getItem('isNewCompany');
    if (newCompanyFlag === 'true') {
      setIsNewCompany(true);
      // Keep the flag for the session - only clear it when user takes action
    }
    
    console.log('Admin Dashboard - Auth successful, rendering dashboard');
  }, [navigate]);

  // Fresh data for new companies
  const freshAnalyticsData = [
    {
      title: 'Total Expenses',
      value: '$0',
      change: '0%',
      changeType: 'neutral',
      icon: 'DollarSign',
      color: 'bg-primary',
      description: 'No expenses yet'
    },
    {
      title: 'Pending Approvals',
      value: '0',
      change: '0%',
      changeType: 'neutral',
      icon: 'Clock',
      color: 'bg-warning',
      description: 'No pending approvals'
    },
    {
      title: 'Active Employees',
      value: '1',
      change: '0%',
      changeType: 'neutral',
      icon: 'Users',
      color: 'bg-accent',
      description: 'Just you for now'
    },
    {
      title: 'Setup Progress',
      value: '25%',
      change: '0%',
      changeType: 'neutral',
      icon: 'Settings',
      color: 'bg-success',
      description: 'Company created'
    }
  ];

  // Mock data for analytics cards
  const analyticsData = [
    {
      title: 'Total Expenses',
      value: '$124,580',
      change: '+12.5%',
      changeType: 'positive',
      icon: 'DollarSign',
      color: 'bg-primary',
      description: 'vs last month'
    },
    {
      title: 'Pending Approvals',
      value: '23',
      change: '-8.2%',
      changeType: 'positive',
      icon: 'Clock',
      color: 'bg-warning',
      description: 'awaiting review'
    },
    {
      title: 'Active Employees',
      value: '156',
      change: '+5.1%',
      changeType: 'positive',
      icon: 'Users',
      color: 'bg-accent',
      description: 'total users'
    },
    {
      title: 'Monthly Trend',
      value: '+18.7%',
      change: '+3.2%',
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'bg-success',
      description: 'growth rate'
    }
  ];

  // Fresh data for new companies
  const freshExpenseByCategory = [
    { name: 'No expenses yet', value: 0, color: '#e5e7eb' }
  ];
  const freshMonthlyTrends = [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 0 },
    { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 },
    { name: 'May', value: 0 },
    { name: 'Jun', value: 0 }
  ];

  // Mock data for expense breakdown chart
  const expenseByCategory = [
    { name: 'Travel', value: 45680 },
    { name: 'Meals', value: 28450 },
    { name: 'Office Supplies', value: 18920 },
    { name: 'Software', value: 15680 },
    { name: 'Marketing', value: 12850 },
    { name: 'Other', value: 8950 }
  ];

  // Mock data for monthly trends
  const monthlyTrends = [
    { name: 'Jan', value: 85420 },
    { name: 'Feb', value: 92180 },
    { name: 'Mar', value: 78650 },
    { name: 'Apr', value: 105320 },
    { name: 'May', value: 118750 },
    { name: 'Jun', value: 124580 }
  ];

  // Fresh data for new companies
  const freshRecentExpenses = [
    {
      id: 'welcome',
      employee: 'Welcome!',
      amount: 0,
      category: 'Getting Started',
      description: 'No expenses submitted yet. Start by adding employees or submitting your first expense.',
      date: new Date().toISOString().split('T')[0],
      status: 'info',
      isPlaceholder: true
    }
  ];

  // Mock data for recent expenses
  const recentExpenses = [
    {
      id: 1,
      employee: 'Sarah Johnson',
      department: 'Sales',
      amount: '$1,245.50',
      category: 'Travel',
      date: '2025-01-03',
      status: 'pending',
      description: 'Client meeting travel expenses'
    },
    {
      id: 2,
      employee: 'Michael Chen',
      department: 'Marketing',
      amount: '$89.25',
      category: 'Meals',
      date: '2025-01-03',
      status: 'approved',
      description: 'Team lunch meeting'
    },
    {
      id: 3,
      employee: 'Emily Rodriguez',
      department: 'IT',
      amount: '$299.99',
      category: 'Software',
      date: '2025-01-02',
      status: 'pending',
      description: 'Development tools subscription'
    },
    {
      id: 4,
      employee: 'David Wilson',
      department: 'Operations',
      amount: '$156.80',
      category: 'Office Supplies',
      date: '2025-01-02',
      status: 'rejected',
      description: 'Office equipment purchase'
    },
    {
      id: 5,
      employee: 'Lisa Thompson',
      department: 'HR',
      amount: '$450.00',
      category: 'Travel',
      date: '2025-01-01',
      status: 'approved',
      description: 'Conference attendance'
    }
  ];

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: 'New Expense Submitted',
      message: 'Sarah Johnson submitted a travel expense for $1,245.50 requiring approval',
      type: 'submission',
      timestamp: new Date(Date.now() - 300000),
      read: false,
      actionRequired: true
    },
    {
      id: 2,
      title: 'Monthly Report Ready',
      message: 'December expense report has been generated and is ready for review',
      type: 'system',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      actionRequired: false
    },
    {
      id: 3,
      title: 'Expense Approved',
      message: 'Michael Chen\'s meal expense has been automatically approved',
      type: 'approval',
      timestamp: new Date(Date.now() - 7200000),
      read: true,
      actionRequired: false
    },
    {
      id: 4,
      title: 'Policy Violation Alert',
      message: 'David Wilson\'s expense exceeds department budget limits',
      type: 'rejection',
      timestamp: new Date(Date.now() - 86400000),
      read: true,
      actionRequired: true
    }
  ];

  // Handler functions
  const handleApproveExpense = (expenseId) => {
    console.log('Approving expense:', expenseId);
    // Implementation for expense approval
  };

  const handleRejectExpense = (expenseId) => {
    console.log('Rejecting expense:', expenseId);
    // Implementation for expense rejection
  };

  const handleViewExpenseDetails = (expense) => {
    console.log('Viewing expense details:', expense);
    // Implementation for viewing expense details
  };

  const handleMarkNotificationAsRead = (notificationId) => {
    console.log('Marking notification as read:', notificationId);
    // Implementation for marking notification as read
  };

  const handleViewAllNotifications = () => {
    console.log('Viewing all notifications');
    // Navigate to notifications page
  };

  const handleAddEmployee = () => {
    setIsAddEmployeeModalOpen(true);
  };

  const handleAddEmployeeSubmit = (newEmployee) => {
    setEmployees(prev => [...prev, newEmployee]);
    // Clear new company flag when user starts adding employees
    if (isNewCompany) {
      setIsNewCompany(false);
      localStorage.removeItem('isNewCompany');
    }
    // Show success notification
    console.log('Employee added successfully:', newEmployee);
  };

  const handleConfigureRules = () => {
    console.log('Configuring approval rules');
    // Clear new company flag when user starts configuring
    if (isNewCompany) {
      setIsNewCompany(false);
      localStorage.removeItem('isNewCompany');
    }
    // Implementation for configuring rules
  };


  const handleGenerateReport = () => {
    console.log('Generating report');
    // Clear new company flag when user starts generating reports
    if (isNewCompany) {
      setIsNewCompany(false);
      localStorage.removeItem('isNewCompany');
    }
    navigate('/analytics-and-reports');
  };

  return (
    <div className="min-h-screen bg-background">
      <WorkflowHeader 
        title="Admin Dashboard"
        userRole="admin"
        actions={[
          {
            label: 'Export Data',
            icon: 'Download',
            variant: 'outline',
            onClick: () => console.log('Export data')
          }
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">
                {isNewCompany ? 'Welcome to ExpenseFlow!' : 'Welcome back, Admin'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isNewCompany 
                  ? 'Your company account has been created successfully. Start by adding employees and setting up your expense policies.'
                  : 'Here\'s what\'s happening with your company expenses today.'
                }
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Debug Info - Remove in production */}
              <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                Auth: {localStorage.getItem('isAuthenticated')} | Role: {localStorage.getItem('userRole')}
              </div>
              <NotificationBell 
                notifications={notifications}
                onMarkAsRead={handleMarkNotificationAsRead}
                onMarkAllAsRead={handleViewAllNotifications}
                onNotificationClick={handleViewExpenseDetails}
              />
            </div>
          </div>
        </div>

        {/* Get Started Section for New Companies */}
        {isNewCompany && (
          <div className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Rocket" size={24} className="text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Welcome to ExpenseFlow! 🎉
                </h3>
                <p className="text-muted-foreground mb-4">
                  Your company account has been created successfully. Here's what you can do to get started:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg">
                    <Icon name="UserPlus" size={20} className="text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Add Employees</p>
                      <p className="text-sm text-muted-foreground">Invite your team members</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg">
                    <Icon name="Settings" size={20} className="text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Configure Rules</p>
                      <p className="text-sm text-muted-foreground">Set up approval workflows</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg">
                    <Icon name="FileText" size={20} className="text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Submit Expenses</p>
                      <p className="text-sm text-muted-foreground">Start tracking expenses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {(isNewCompany ? freshAnalyticsData : analyticsData)?.map((data, index) => (
            <AnalyticsCard key={index} {...data} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions
            onAddEmployee={handleAddEmployee}
            onConfigureRules={handleConfigureRules}
            onGenerateReport={handleGenerateReport}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ExpenseChart
            type="pie"
            data={isNewCompany ? freshExpenseByCategory : expenseByCategory}
            title="Expenses by Category"
            height={300}
          />
          <ExpenseChart
            type="bar"
            data={isNewCompany ? freshMonthlyTrends : monthlyTrends}
            title="Monthly Expense Trends"
            height={300}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Expense Table */}
          <div className="lg:col-span-2">
            <ExpenseTable
              expenses={isNewCompany ? freshRecentExpenses : recentExpenses}
              onApprove={handleApproveExpense}
              onReject={handleRejectExpense}
              onViewDetails={handleViewExpenseDetails}
            />
          </div>

          {/* Notification Panel */}
          <div className="lg:col-span-1">
            <NotificationPanel
              notifications={notifications}
              onMarkAsRead={handleMarkNotificationAsRead}
              onViewAll={handleViewAllNotifications}
            />
          </div>
        </div>
      </div>
      
      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddEmployeeModalOpen}
        onClose={() => setIsAddEmployeeModalOpen(false)}
        onAddEmployee={handleAddEmployeeSubmit}
      />
    </div>
  );
};

export default AdminDashboard;