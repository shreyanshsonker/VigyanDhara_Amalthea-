import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityIndicators = () => {
  const securityFeatures = [
    {
      icon: 'Lock',
      text: 'SSL Encrypted',
      description: 'Your data is protected with 256-bit encryption'
    },
    {
      icon: 'Shield',
      text: 'SOC 2 Compliant',
      description: 'Industry-standard security protocols'
    },
    {
      icon: 'Eye',
      text: 'Privacy Protected',
      description: 'We never share your personal information'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="text-center mb-4">
        <p className="text-xs text-muted-foreground font-medium">
          Trusted by 10,000+ companies worldwide
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {securityFeatures?.map((feature, index) => (
          <div 
            key={index}
            className="flex items-center space-x-2 group cursor-help"
            title={feature?.description}
          >
            <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center">
              <Icon 
                name={feature?.icon} 
                size={12} 
                className="text-success group-hover:scale-110 transition-transform duration-200" 
              />
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-200">
              {feature?.text}
            </span>
          </div>
        ))}
      </div>
      {/* Trust Badges */}
      <div className="flex justify-center items-center space-x-4 mt-4 opacity-60">
        <div className="flex items-center space-x-1">
          <Icon name="Award" size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">ISO 27001</span>
        </div>
        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
        <div className="flex items-center space-x-1">
          <Icon name="CheckCircle" size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">GDPR Ready</span>
        </div>
        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
        <div className="flex items-center space-x-1">
          <Icon name="Globe" size={14} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Global Access</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityIndicators;