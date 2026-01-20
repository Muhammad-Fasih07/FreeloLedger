'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ProjectData {
  projectId: string;
  projectName: string;
  income: number;
  expenses: number;
  profit: number;
}

interface ProjectProfitabilityChartProps {
  data: ProjectData[];
}

const COLORS = ['#0B63FF', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function ProjectProfitabilityChart({ data }: ProjectProfitabilityChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const chartData = data.map((item, index) => ({
    name: item.projectName.length > 20 
      ? `${item.projectName.substring(0, 20)}...` 
      : item.projectName,
    value: item.profit,
    fullName: item.projectName,
    income: item.income,
    expenses: item.expenses,
    color: COLORS[index % COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{data.fullName}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Profit: {formatCurrency(data.value)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Income: {formatCurrency(data.income)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Expenses: {formatCurrency(data.expenses)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
