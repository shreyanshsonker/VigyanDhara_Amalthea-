import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const DashboardNavigation = ({ userRole = 'admin', userName = 'User' }) => {
  const navigate = useNavigate();

  const getNavigationCards = () => {
    const baseCards = [
      {
        title: 'Analytics & Reports',
        description: 'View comprehensive expense analytics and generate reports',
        icon: 'BarChart3',
        path: '/analytics-and-reports',
        color: 'bg-accent',
        stats: '12 reports available'
      }
    ];

    switch (userRole) {
      case 'admin':
        return [
          {
            title: 'Admin Dashboard',
            description: 'Manage company settings and user permissions',
            icon: 'Settings',
            path: '/admin-dashboard',
            color: 'bg-primary',
            stats: 'Full access'
          },
          {
            title: 'Approval Workflow',
            description: 'Review and approve pending expense submissions',
            icon: 'CheckCircle',
            path: '/approval-workflow',
            color: 'bg-warning',
            stats: '8 pending approvals'
          },
          ...baseCards
        ];
      
      case 'manager':
        return [
          {
            title: 'Manager Dashboard',
            description: 'Oversee team expenses and approval processes',
            icon: 'Users',
            path: '/manager-dashboard',
            color: 'bg-primary',
            stats: 'Team overview'
          },
          {
            title: 'Approval Workflow',
            description: 'Review and approve team expense submissions',
            icon: 'CheckCircle',
            path: '/approval-workflow',
            color: 'bg-warning',
            stats: '3 pending approvals'
          },
          ...baseCards
        ];
      
      case 'employee':
        return [
          {
            title: 'Employee Dashboard',
            description: 'Submit expenses and track your approvals',
            icon: 'User',
            path: '/employee-dashboard',
            color: 'bg-primary',
            stats: 'Personal overview'
          },
          {
            title: 'Submit Expense',
            description: 'Create new expense submissions with OCR',
            icon: 'Plus',
            path: '/employee-dashboard?tab=submit',
            color: 'bg-success',
            stats: 'Quick submit'
          },
          {
            title: 'My Expenses',
            description: 'View your expense history and status',
            icon: 'FileText',
            path: '/employee-dashboard?tab=history',
            color: 'bg-accent',
            stats: 'Track expenses'
          },
          ...baseCards
        ];
      
      default:
        return baseCards;
    }
  };

  const quickActions = [
    {
      label: 'Submit Expense',
      icon: 'Plus',
      variant: 'default',
      onClick: () => console.log('Submit expense')
    },
    {
      label: 'View Reports',
      icon: 'FileText',
      variant: 'outline',
      onClick: () => navigate('/analytics-and-reports')
    }
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="w-full space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Welcome back, {userName}
        </h1>
        <p className="text-muted-foreground">
          Manage your expenses efficiently with ExpenseFlow
        </p>
      </div>
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        {quickActions?.map((action, index) => (
          <Button
            key={index}
            variant={action?.variant}
            onClick={action?.onClick}
            iconName={action?.icon}
            iconPosition="left"
            className="hover-scale"
          >
            {action?.label}
          </Button>
        ))}
      </div>
      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {getNavigationCards()?.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(card?.path)}
            className="bg-card border border-border rounded-lg p-6 cursor-pointer hover-scale transition-all duration-200 hover:shadow-elevation-2 group"
          >
            <div className="flex items-start space-x-4">
              <div className={`${card?.color} rounded-lg p-3 group-hover:scale-105 transition-transform duration-200`}>
                <Icon name={card?.icon} size={24} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-card-foreground group-hover:text-primary transition-colors duration-200">
                  {card?.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {card?.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {card?.stats}
                  </span>
                  <Icon 
                    name="ArrowRight" 
                    size={16} 
                    className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" 
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Recent Activity Preview */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium text-card-foreground">Recent Activity</h2>
            <Button variant="ghost" size="sm" iconName="ExternalLink">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {[
              { action: 'Expense submitted', amount: '$124.50', time: '2 hours ago', status: 'pending' },
              { action: 'Report generated', amount: 'Monthly Summary', time: '1 day ago', status: 'completed' },
              { action: 'Approval processed', amount: '$89.25', time: '2 days ago', status: 'approved' }
            ]?.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    item?.status === 'pending' ? 'bg-warning' :
                    item?.status === 'approved' ? 'bg-success' : 'bg-accent'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{item?.action}</p>
                    <p className="text-xs text-muted-foreground">{item?.time}</p>
                  </div>
                </div>
                <span className="text-sm font-mono text-muted-foreground">{item?.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavigation;