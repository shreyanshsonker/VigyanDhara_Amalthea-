import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkflowHeader from '../../components/ui/WorkflowHeader';
import NotificationBell from '../../components/ui/NotificationBell';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ExpenseSubmissionForm from './components/ExpenseSubmissionForm';
import PersonalExpenseHistory from './components/PersonalExpenseHistory';
import ApprovalJourneyTimeline from './components/ApprovalJourneyTimeline';
import PersonalAnalytics from './components/PersonalAnalytics';
import EmployeeNotifications from './components/EmployeeNotifications';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('submit');
  const [notifications, setNotifications] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication and employee role
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    
    // Redirect to login if not authenticated or not employee
    if (isAuthenticated !== 'true' || userRole !== 'employee') {
      navigate('/login');
      return;
    }
    
    // Check for tab parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['submit', 'history', 'timeline', 'analytics', 'notifications'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    
    // Load employee data
    loadEmployeeData();
  }, [navigate]);

  const loadEmployeeData = async () => {
    setIsLoading(true);
    
    // Mock data loading
    setTimeout(() => {
      setNotifications([
        {
          id: '1',
          type: 'approval',
          title: 'Expense Approved',
          message: 'Your $150 meal expense has been approved by John Doe',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: false
        },
        {
          id: '2',
          type: 'rejection',
          title: 'Expense Rejected',
          message: 'Your $75 travel expense was rejected. Please provide additional documentation.',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          isRead: false
        },
        {
          id: '3',
          type: 'comment',
          title: 'New Comment',
          message: 'Manager added a comment to your $200 office supply expense',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          isRead: true
        }
      ]);

      setExpenses([
        {
          id: '1',
          amount: 150.00,
          category: 'Meals',
          description: 'Client lunch meeting',
          date: '2024-01-15',
          status: 'approved',
          receipt: '/receipts/receipt1.jpg',
          submittedAt: '2024-01-15T10:30:00Z',
          approvedAt: '2024-01-15T14:20:00Z',
          approvedBy: 'John Doe'
        },
        {
          id: '2',
          amount: 75.00,
          category: 'Travel',
          description: 'Taxi to client office',
          date: '2024-01-14',
          status: 'rejected',
          receipt: '/receipts/receipt2.jpg',
          submittedAt: '2024-01-14T16:45:00Z',
          rejectedAt: '2024-01-15T09:15:00Z',
          rejectedBy: 'Jane Smith',
          rejectionReason: 'Please provide additional documentation'
        },
        {
          id: '3',
          amount: 200.00,
          category: 'Office Supplies',
          description: 'Stationery and supplies',
          date: '2024-01-13',
          status: 'pending',
          receipt: '/receipts/receipt3.jpg',
          submittedAt: '2024-01-13T11:20:00Z'
        }
      ]);

      setIsLoading(false);
    }, 1000);
  };

  const handleMarkNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleExpenseSubmitted = (newExpense) => {
    setExpenses(prev => [newExpense, ...prev]);
  };

  const tabs = [
    {
      id: 'submit',
      label: 'Submit Expense',
      icon: 'Plus',
      description: 'Submit new expense with OCR support'
    },
    {
      id: 'history',
      label: 'My Expenses',
      icon: 'FileText',
      description: 'View expense history and status'
    },
    {
      id: 'timeline',
      label: 'Approval Journey',
      icon: 'Clock',
      description: 'Track approval progress'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'BarChart3',
      description: 'Personal spending insights'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'Bell',
      description: 'Updates and comments',
      badge: notifications.filter(n => !n.isRead).length
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'submit':
        return <ExpenseSubmissionForm onExpenseSubmitted={handleExpenseSubmitted} />;
      case 'history':
        return <PersonalExpenseHistory expenses={expenses} />;
      case 'timeline':
        return <ApprovalJourneyTimeline expenses={expenses} />;
      case 'analytics':
        return <PersonalAnalytics expenses={expenses} />;
      case 'notifications':
        return (
          <EmployeeNotifications
            notifications={notifications}
            onMarkAsRead={handleMarkNotificationAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        );
      default:
        return <ExpenseSubmissionForm onExpenseSubmitted={handleExpenseSubmitted} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <WorkflowHeader 
        title="Employee Dashboard"
        userRole="employee"
        actions={[
          {
            label: 'Help',
            icon: 'HelpCircle',
            variant: 'outline',
            onClick: () => console.log('Open help')
          }
        ]}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">
                Welcome back, Employee!
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your expenses, track approvals, and view your spending insights.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationBell 
                notifications={notifications}
                onMarkAsRead={handleMarkNotificationAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Submitted</p>
                <p className="text-2xl font-bold text-foreground">{expenses.length}</p>
              </div>
              <Icon name="FileText" size={24} className="text-primary" />
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">
                  {expenses.filter(e => e.status === 'pending').length}
                </p>
              </div>
              <Icon name="Clock" size={24} className="text-warning" />
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-success">
                  {expenses.filter(e => e.status === 'approved').length}
                </p>
              </div>
              <Icon name="CheckCircle" size={24} className="text-success" />
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-foreground">
                  ${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                </p>
              </div>
              <Icon name="DollarSign" size={24} className="text-primary" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                  {tab.badge && tab.badge > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-card border border-border rounded-lg">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
