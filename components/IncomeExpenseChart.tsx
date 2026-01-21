'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendData {
  month: string;
  income: number;
  expenses: number;
}

interface IncomeExpenseChartProps {
  data: TrendData[];
  currency?: string;
}

export default function IncomeExpenseChart({ data, currency = 'USD' }: IncomeExpenseChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
        <XAxis
          dataKey="month"
          stroke="#6b7280"
          className="dark:stroke-gray-400"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#6b7280"
          className="dark:stroke-gray-400"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatCurrency}
        />
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{
            backgroundColor: 'var(--card)',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            color: 'var(--foreground)',
          }}
        />
        <Legend />
        <Bar dataKey="income" fill="#22C55E" name="Income" radius={[8, 8, 0, 0]} />
        <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
