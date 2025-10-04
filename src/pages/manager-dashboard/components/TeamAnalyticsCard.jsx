import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const TeamAnalyticsCard = ({ title, data, type = 'bar', icon, value, change, period = 'vs last month' }) => {
  const COLORS = ['#2563EB', '#059669', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return 'TrendingUp';
    if (change < 0) return 'TrendingDown';
    return 'Minus';
  };

  const renderChart = () => {
    if (type === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="name" 
            stroke="var(--color-muted-foreground)"
            fontSize={12}
          />
          <YAxis 
            stroke="var(--color-muted-foreground)"
            fontSize={12}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip 
            formatter={(value) => [formatCurrency(value), 'Amount']}
            labelStyle={{ color: 'var(--color-foreground)' }}
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px'
            }}
          />
          <Bar 
            dataKey="value" 
            fill="var(--color-primary)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderLegend = () => {
    if (type !== 'pie') return null;

    return (
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data?.map((entry, index) => (
          <div key={entry?.name} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
            />
            <span className="text-xs text-muted-foreground truncate">
              {entry?.name}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-elevation-1 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={icon} size={20} className="text-primary" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-card-foreground">{title}</h3>
            {value && (
              <p className="text-2xl font-bold text-card-foreground mt-1">
                {typeof value === 'number' ? formatCurrency(value) : value}
              </p>
            )}
          </div>
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 ${getChangeColor(change)}`}>
            <Icon name={getChangeIcon(change)} size={16} />
            <span className="text-sm font-medium">
              {Math.abs(change)}%
            </span>
          </div>
        )}
      </div>

      {/* Change Indicator */}
      {change !== undefined && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground">
            <span className={getChangeColor(change)}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            {' '}{period}
          </p>
        </div>
      )}

      {/* Chart */}
      <div className="w-full">
        {renderChart()}
        {renderLegend()}
      </div>
    </div>
  );
};

export default TeamAnalyticsCard;