import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center space-y-6 mb-8">
      {/* Company Logo */}
      <div className="flex items-center justify-center space-x-3">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
          <Icon name="Receipt" size={28} color="white" />
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-foreground">ExpenseFlow</h1>
          <p className="text-sm text-muted-foreground">Smart Expense Management</p>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-foreground">Welcome Back</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Sign in to your account to manage expenses, track approvals, and access your dashboard.
        </p>
      </div>

      {/* Value Proposition */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
        <div className="flex flex-col items-center space-y-2 p-3 bg-card rounded-lg border border-border">
          <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={16} className="text-success" />
          </div>
          <span className="text-xs font-medium text-card-foreground">Fast Processing</span>
        </div>
        
        <div className="flex flex-col items-center space-y-2 p-3 bg-card rounded-lg border border-border">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={16} className="text-primary" />
          </div>
          <span className="text-xs font-medium text-card-foreground">Secure & Safe</span>
        </div>
        
        <div className="flex flex-col items-center space-y-2 p-3 bg-card rounded-lg border border-border">
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={16} className="text-accent" />
          </div>
          <span className="text-xs font-medium text-card-foreground">Smart Analytics</span>
        </div>
      </div>
    </div>
  );
};

export default LoginHeader;