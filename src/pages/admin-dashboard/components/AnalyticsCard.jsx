import React from 'react';
import Icon from '../../../components/AppIcon';

const AnalyticsCard = ({ title, value, change, changeType, icon, color, description }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover-scale transition-all duration-200 hover:shadow-elevation-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`${color} rounded-lg p-3`}>
            <Icon name={icon} size={24} color="white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold text-card-foreground">{value}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            <Icon name={getChangeIcon()} size={16} />
            <span className="text-sm font-medium">{change}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;