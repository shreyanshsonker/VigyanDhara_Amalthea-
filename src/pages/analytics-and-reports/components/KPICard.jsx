import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, change, changeType, icon, color = 'bg-primary' }) => {
  const getChangeIcon = () => {
    if (changeType === 'increase') return 'TrendingUp';
    if (changeType === 'decrease') return 'TrendingDown';
    return 'Minus';
  };

  const getChangeColor = () => {
    if (changeType === 'increase') return 'text-success';
    if (changeType === 'decrease') return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover-scale transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-semibold text-card-foreground">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${getChangeColor()}`}>
              <Icon name={getChangeIcon()} size={16} className="mr-1" />
              <span className="text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        <div className={`${color} rounded-lg p-3`}>
          <Icon name={icon} size={24} color="white" />
        </div>
      </div>
    </div>
  );
};

export default KPICard;