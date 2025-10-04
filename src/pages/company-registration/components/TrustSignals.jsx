import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'Bank-Level Security',
      description: '256-bit SSL encryption protects your data'
    },
    {
      icon: 'Lock',
      title: 'Data Privacy',
      description: 'GDPR compliant with strict privacy controls'
    },
    {
      icon: 'FileCheck',
      title: 'Audit Ready',
      description: 'Complete audit trails for compliance'
    },
    {
      icon: 'Users',
      title: 'Trusted by 10,000+',
      description: 'Companies worldwide trust ExpenseFlow'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 mt-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">
          Why Companies Trust ExpenseFlow
        </h3>
        <p className="text-sm text-muted-foreground">
          Enterprise-grade security and compliance built-in
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trustFeatures?.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="bg-primary/10 rounded-lg p-2 mt-0.5">
              <Icon name={feature?.icon} size={16} className="text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-card-foreground">
                {feature?.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {feature?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-success" />
          <span className="text-xs text-muted-foreground">SSL Secured</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Database" size={16} className="text-success" />
          <span className="text-xs text-muted-foreground">Data Encrypted</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="CheckCircle" size={16} className="text-success" />
          <span className="text-xs text-muted-foreground">SOC 2 Compliant</span>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;