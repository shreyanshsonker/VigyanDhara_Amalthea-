import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ExpenseChart = ({ type = 'pie', data, title, height = 300 }) => {
  const COLORS = ['#2563EB', '#059669', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, 'Amount']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value?.toLocaleString()}`, 'Amount']} />
        <Legend />
        <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">{title}</h3>
      {type === 'pie' ? renderPieChart() : renderBarChart()}
    </div>
  );
};

export default ExpenseChart;