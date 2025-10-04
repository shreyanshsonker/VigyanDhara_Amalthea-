import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DemoCredentials = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const credentials = [
    {
      role: 'Admin',
      email: 'admin@expenseflow.com',
      password: 'admin123',
      description: 'Full system access with user management',
      color: 'bg-primary',
      company: 'ExpenseFlow Demo Company'
    },
    {
      role: 'Manager',
      email: 'manager@expenseflow.com',
      password: 'manager123',
      description: 'Team oversight and approval workflows',
      color: 'bg-accent',
      company: 'ExpenseFlow Demo Company'
    },
    {
      role: 'Employee',
      email: 'employee@expenseflow.com',
      password: 'employee123',
      description: 'Submit expenses and track approvals',
      color: 'bg-secondary',
      company: 'ExpenseFlow Demo Company'
    }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="mt-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
        iconPosition="right"
        className="w-full text-muted-foreground hover:text-foreground"
      >
        Demo Credentials
      </Button>
      {isExpanded && (
        <div className="mt-4 space-y-3 p-4 bg-muted/30 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground text-center mb-3">
            Use these credentials to explore different user roles
          </p>
          
          {credentials?.map((cred, index) => (
            <div key={index} className="bg-card rounded-lg p-3 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${cred?.color} rounded-full`}></div>
                  <span className="text-sm font-medium text-card-foreground">{cred?.role}</span>
                </div>
                <span className="text-xs text-muted-foreground">{cred?.description}</span>
              </div>
              <div className="mb-2">
                <span className="text-xs text-muted-foreground">Company: </span>
                <span className="text-xs font-medium text-card-foreground">{cred?.company}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-muted/50 rounded px-2 py-1">
                  <span className="text-xs font-mono text-muted-foreground">{cred?.email}</span>
                  <button
                    onClick={() => copyToClipboard(cred?.email)}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    <Icon name="Copy" size={12} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between bg-muted/50 rounded px-2 py-1">
                  <span className="text-xs font-mono text-muted-foreground">{cred?.password}</span>
                  <button
                    onClick={() => copyToClipboard(cred?.password)}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    <Icon name="Copy" size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              Click the copy icon to copy credentials to clipboard
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoCredentials;