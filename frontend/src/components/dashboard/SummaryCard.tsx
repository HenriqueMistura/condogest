import React from 'react';
import { Card } from '../ui/Card';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorVariant: 'blue' | 'green' | 'red' | 'purple';
}

export function SummaryCard({ title, value, icon: Icon, trend, colorVariant }: SummaryCardProps) {
  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`p-2 rounded-lg ${colorMap[colorVariant]}`}>
          <Icon size={20} />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span className="font-medium">{trend.value}%</span>
            <span className="text-slate-400 ml-1">vs mês anterior</span>
          </div>
        )}
      </div>
    </Card>
  );
}
