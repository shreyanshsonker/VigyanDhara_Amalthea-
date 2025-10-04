import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onAddEmployee, onConfigureRules, onGenerateReport }) => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Add Employee',
      icon: 'UserPlus',
      variant: 'default',
      onClick: onAddEmployee,
      description: 'Create new employee account'
    },
    {
      label: 'Configure Rules',
      icon: 'Settings',
      variant: 'outline',
      onClick: onConfigureRules,
      description: 'Set up approval workflows'
    },
    {
      label: 'Generate Report',
      icon: 'FileText',
      variant: 'outline',
      onClick: onGenerateReport,
      description: 'Create expense reports'
    },
    {
      label: 'View Analytics',
      icon: 'BarChart3',
      variant: 'ghost',
      onClick: () => navigate('/analytics-and-reports'),
      description: 'Detailed insights & charts'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions?.map((action, index) => (
          <div key={index} className="group">
            <Button
              variant={action?.variant}
              onClick={action?.onClick}
              iconName={action?.icon}
              iconPosition="left"
              fullWidth
              className="hover-scale h-auto py-4 flex-col space-y-2"
            >
              <span className="font-medium">{action?.label}</span>
              <span className="text-xs opacity-80 font-normal">
                {action?.description}
              </span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;