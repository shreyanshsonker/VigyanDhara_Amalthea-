import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkflowHeader from '../../components/ui/WorkflowHeader';
import NotificationBell from '../../components/ui/NotificationBell';
import Button from '../../components/ui/Button';
import PendingApprovalCard from './components/PendingApprovalCard';
import TeamAnalyticsCard from './components/TeamAnalyticsCard';
import TeamExpenseTable from './components/TeamExpenseTable';
import ExpenseTimelineModal from './components/ExpenseTimelineModal';
import Icon from '../../components/AppIcon';


const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [teamExpenses, setTeamExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for pending approvals
  const mockPendingApprovals = [
    {
      id: 'EXP-2024-001',
      employeeName: 'Sarah Johnson',
      department: 'Sales',
      amount: 245.50,
      currency: 'USD',
      category: 'Travel',
      description: 'Client meeting travel expenses - flight and accommodation for Q4 sales presentation',
      submittedDate: '2024-10-03T10:30:00Z',
      expenseDate: '2024-10-01T00:00:00Z',
      status: 'pending',
      priority: 'high',
      paymentMethod: 'Corporate Card',
      project: 'Q4 Sales Initiative',
      receiptUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
      notes: 'Urgent approval needed for reimbursement processing'
    },
    {
      id: 'EXP-2024-002',
      employeeName: 'Michael Chen',
      department: 'Marketing',
      amount: 89.25,
      currency: 'USD',
      category: 'Meals',
      description: 'Team lunch during marketing strategy workshop',
      submittedDate: '2024-10-02T14:15:00Z',
      expenseDate: '2024-10-02T12:00:00Z',
      status: 'pending',
      priority: 'medium',
      paymentMethod: 'Personal Card',
      project: 'Brand Refresh Campaign',
      receiptUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
      notes: 'Workshop included 8 team members'
    },
    {
      id: 'EXP-2024-003',
      employeeName: 'Emily Rodriguez',
      department: 'Operations',
      amount: 156.75,
      currency: 'USD',
      category: 'Office Supplies',
      description: 'Office equipment and supplies for new workspace setup',
      submittedDate: '2024-10-01T16:45:00Z',
      expenseDate: '2024-09-30T00:00:00Z',
      status: 'pending',
      priority: 'low',
      paymentMethod: 'Corporate Card',
      project: 'Office Expansion',
      receiptUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
      notes: 'Equipment for 3 new workstations'
    }
  ];

  // Mock data for team expenses
  const mockTeamExpenses = [
    ...mockPendingApprovals,
    {
      id: 'EXP-2024-004',
      employeeName: 'David Kim',
      department: 'Engineering',
      amount: 320.00,
      currency: 'USD',
      category: 'Transportation',
      description: 'Uber rides for client site visits',
      submittedDate: '2024-09-28T09:20:00Z',
      expenseDate: '2024-09-27T00:00:00Z',
      status: 'approved',
      paymentMethod: 'Personal Card',
      project: 'Client Integration',
      receiptUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
      approvedDate: '2024-09-29T11:30:00Z'
    },
    {
      id: 'EXP-2024-005',
      employeeName: 'Lisa Wang',
      department: 'Design',
      amount: 75.50,
      currency: 'USD',
      category: 'Entertainment',
      description: 'Client dinner meeting',
      submittedDate: '2024-09-25T18:30:00Z',
      expenseDate: '2024-09-25T19:00:00Z',
      status: 'rejected',
      paymentMethod: 'Personal Card',
      project: 'UI/UX Redesign',
      receiptUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
      rejectedDate: '2024-09-26T10:15:00Z'
    }
  ];

  // Analytics data
  const monthlySpendingData = [
    { name: 'Jan', value: 12500 },
    { name: 'Feb', value: 15200 },
    { name: 'Mar', value: 18900 },
    { name: 'Apr', value: 16700 },
    { name: 'May', value: 21300 },
    { name: 'Jun', value: 19800 }
  ];

  const categoryBreakdownData = [
    { name: 'Travel', value: 45000 },
    { name: 'Meals', value: 28000 },
    { name: 'Office Supplies', value: 15000 },
    { name: 'Transportation', value: 12000 },
    { name: 'Entertainment', value: 8000 }
  ];

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    
    // Redirect to login if not authenticated or not manager
    if (isAuthenticated !== 'true' || userRole !== 'manager') {
      navigate('/login');
      return;
    }

    // Simulate API loading
    const loadData = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPendingApprovals(mockPendingApprovals);
      setTeamExpenses(mockTeamExpenses);
      setIsLoading(false);
    };

    loadData();
  }, [navigate]);

  const handleApproveExpense = async (expenseId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPendingApprovals(prev => prev?.filter(expense => expense?.id !== expenseId));
      setTeamExpenses(prev => 
        prev?.map(expense => 
          expense?.id === expenseId 
            ? { ...expense, status: 'approved', approvedDate: new Date()?.toISOString() }
            : expense
        )
      );
      
      console.log(`Approved expense: ${expenseId}`);
    } catch (error) {
      console.error('Error approving expense:', error);
    }
  };

  const handleRejectExpense = async (expenseId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPendingApprovals(prev => prev?.filter(expense => expense?.id !== expenseId));
      setTeamExpenses(prev => 
        prev?.map(expense => 
          expense?.id === expenseId 
            ? { ...expense, status: 'rejected', rejectedDate: new Date()?.toISOString() }
            : expense
        )
      );
      
      console.log(`Rejected expense: ${expenseId}`);
    } catch (error) {
      console.error('Error rejecting expense:', error);
    }
  };

  const handleViewDetails = (expense) => {
    setSelectedExpense(expense);
    setIsTimelineModalOpen(true);
  };

  const handleBulkAction = async (action, expenseIds) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (action === 'approve') {
        expenseIds?.forEach(id => handleApproveExpense(id));
      } else if (action === 'reject') {
        expenseIds?.forEach(id => handleRejectExpense(id));
      }
      
      console.log(`Bulk ${action} for expenses:`, expenseIds);
    } catch (error) {
      console.error(`Error in bulk ${action}:`, error);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'view-all-approvals': navigate('/approval-workflow');
        break;
      case 'generate-report': navigate('/analytics-and-reports');
        break;
      case 'escalate-expense': console.log('Escalate expense functionality');
        break;
      default:
        console.log(`Quick action: ${action}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <WorkflowHeader userRole="manager" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <WorkflowHeader 
        userRole="manager"
        actions={[
          {
            label: 'Generate Report',
            icon: 'FileText',
            variant: 'default',
            onClick: () => handleQuickAction('generate-report')
          },
          {
            label: 'View All Approvals',
            icon: 'CheckCircle',
            variant: 'outline',
            onClick: () => handleQuickAction('view-all-approvals')
          }
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Manager Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage team expenses and approvals efficiently
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationBell 
                onMarkAsRead={() => console.log('Mark as read')}
                onMarkAllAsRead={() => console.log('Mark all as read')}
                onNotificationClick={(notification) => console.log('Notification clicked:', notification)}
              />
              <Button
                variant="default"
                onClick={() => handleQuickAction('generate-report')}
                iconName="BarChart3"
                iconPosition="left"
              >
                View Analytics
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                <p className="text-2xl font-bold text-warning">{pendingApprovals?.length}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Icon name="Clock" size={24} className="text-warning" />
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Team Expenses</p>
                <p className="text-2xl font-bold text-primary">{teamExpenses?.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Users" size={24} className="text-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Total</p>
                <p className="text-2xl font-bold text-success">$21,300</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon name="DollarSign" size={24} className="text-success" />
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Processing</p>
                <p className="text-2xl font-bold text-accent">2.3 days</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon name="Timer" size={24} className="text-accent" />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">Pending Approvals</h2>
            <Button
              variant="outline"
              onClick={() => handleQuickAction('view-all-approvals')}
              iconName="ArrowRight"
              iconPosition="right"
            >
              View All
            </Button>
          </div>
          
          {pendingApprovals?.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">No pending approvals at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {pendingApprovals?.slice(0, 6)?.map((expense) => (
                <PendingApprovalCard
                  key={expense?.id}
                  expense={expense}
                  onApprove={handleApproveExpense}
                  onReject={handleRejectExpense}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>

        {/* Team Analytics Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Team Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TeamAnalyticsCard
              title="Monthly Spending Trend"
              data={monthlySpendingData}
              type="bar"
              icon="TrendingUp"
              value={21300}
              change={12.5}
              period="vs last month"
            />
            <TeamAnalyticsCard
              title="Expense Categories"
              data={categoryBreakdownData}
              type="pie"
              icon="PieChart"
              value="5 Categories"
              change={-2.1}
              period="vs last month"
            />
          </div>
        </div>

        {/* Team Expenses Table */}
        <div className="mb-8">
          <TeamExpenseTable
            expenses={teamExpenses}
            onViewDetails={handleViewDetails}
            onBulkAction={handleBulkAction}
          />
        </div>
      </div>
      {/* Timeline Modal */}
      <ExpenseTimelineModal
        expense={selectedExpense}
        isOpen={isTimelineModalOpen}
        onClose={() => {
          setIsTimelineModalOpen(false);
          setSelectedExpense(null);
        }}
      />
    </div>
  );
};

export default ManagerDashboard;