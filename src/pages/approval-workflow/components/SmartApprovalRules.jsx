import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SmartApprovalRules = ({ expense, rules, userRole }) => {
  const [showAllRules, setShowAllRules] = useState(false);

  const evaluateRule = (rule, expense) => {
    switch (rule?.type) {
      case 'amount_threshold':
        return expense?.amount >= rule?.threshold;
      case 'category_specific':
        return rule?.categories?.includes(expense?.category);
      case 'department_specific':
        return rule?.departments?.includes(expense?.employee?.department);
      case 'manager_approval':
        return rule?.requiresManager;
      default:
        return false;
    }
  };

  const getApplicableRules = () => {
    return rules?.filter(rule => evaluateRule(rule, expense));
  };

  const getRuleIcon = (type) => {
    switch (type) {
      case 'amount_threshold':
        return 'DollarSign';
      case 'category_specific':
        return 'Tag';
      case 'department_specific':
        return 'Building';
      case 'manager_approval':
        return 'Users';
      case 'auto_approve':
        return 'Zap';
      default:
        return 'Settings';
    }
  };

  const getRuleColor = (type) => {
    switch (type) {
      case 'amount_threshold':
        return 'text-warning bg-warning/10';
      case 'category_specific':
        return 'text-primary bg-primary/10';
      case 'department_specific':
        return 'text-accent bg-accent/10';
      case 'manager_approval':
        return 'text-secondary bg-secondary/10';
      case 'auto_approve':
        return 'text-success bg-success/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const applicableRules = getApplicableRules();
  const displayRules = showAllRules ? applicableRules : applicableRules?.slice(0, 3);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Smart Approval Rules</h3>
        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={16} className="text-primary" />
          <span className="text-sm text-primary font-medium">
            {applicableRules?.length} rules apply
          </span>
        </div>
      </div>
      {/* Rule Summary */}
      <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Info" size={16} className="text-primary" />
          <span className="text-sm font-medium text-primary">Approval Path</span>
        </div>
        <p className="text-sm text-card-foreground">
          Based on the expense amount of {formatCurrency(expense?.amount)} and category "{expense?.category}", 
          this expense requires {applicableRules?.length > 0 ? 'manager approval' : 'standard review'}.
        </p>
      </div>
      {/* Applicable Rules */}
      <div className="space-y-4">
        {displayRules?.length === 0 ? (
          <div className="text-center py-6">
            <Icon name="CheckCircle" size={32} className="text-success mx-auto mb-2" />
            <p className="text-sm text-success font-medium">No special rules apply</p>
            <p className="text-xs text-muted-foreground">Standard approval process will be followed</p>
          </div>
        ) : (
          displayRules?.map((rule, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getRuleColor(rule?.type)}`}>
                <Icon name={getRuleIcon(rule?.type)} size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-card-foreground mb-1">
                  {rule?.name}
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {rule?.description}
                </p>
                
                {/* Rule Details */}
                <div className="space-y-1">
                  {rule?.type === 'amount_threshold' && (
                    <div className="text-xs text-card-foreground">
                      <span className="font-medium">Threshold:</span> {formatCurrency(rule?.threshold)}
                    </div>
                  )}
                  
                  {rule?.type === 'category_specific' && (
                    <div className="text-xs text-card-foreground">
                      <span className="font-medium">Categories:</span> {rule?.categories?.join(', ')}
                    </div>
                  )}
                  
                  {rule?.approvers && rule?.approvers?.length > 0 && (
                    <div className="text-xs text-card-foreground">
                      <span className="font-medium">Required Approvers:</span> {rule?.approvers?.join(', ')}
                    </div>
                  )}
                  
                  {rule?.escalationTime && (
                    <div className="text-xs text-card-foreground">
                      <span className="font-medium">Escalation Time:</span> {rule?.escalationTime} hours
                    </div>
                  )}
                </div>

                {/* Rule Status */}
                <div className="mt-2 flex items-center space-x-2">
                  <Icon name="CheckCircle" size={12} className="text-success" />
                  <span className="text-xs text-success">Rule Applied</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Show More/Less Button */}
      {applicableRules?.length > 3 && (
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllRules(!showAllRules)}
            iconName={showAllRules ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {showAllRules ? 'Show Less' : `Show ${applicableRules?.length - 3} More Rules`}
          </Button>
        </div>
      )}
      {/* Rule Configuration (Admin Only) */}
      {userRole === 'admin' && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-card-foreground">Rule Configuration</h4>
              <p className="text-xs text-muted-foreground">Manage approval rules and thresholds</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="Settings"
              iconPosition="left"
              onClick={() => console.log('Configure rules')}
            >
              Configure
            </Button>
          </div>
        </div>
      )}
      {/* Quick Rule Actions */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-sm font-medium text-card-foreground mb-3">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Eye"
            iconPosition="left"
            onClick={() => console.log('View all rules')}
          >
            View All Rules
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="History"
            iconPosition="left"
            onClick={() => console.log('Rule history')}
          >
            Rule History
          </Button>
          {userRole === 'admin' && (
            <Button
              variant="ghost"
              size="sm"
              iconName="Plus"
              iconPosition="left"
              onClick={() => console.log('Add rule')}
            >
              Add Rule
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartApprovalRules;