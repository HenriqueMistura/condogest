import React from 'react';
import { Card } from '../ui/Card';

interface InadimplenciaGaugeProps {
  taxa: number; // Percentage
  totalInadimplentes: number;
  totalUnidades: number;
}

export function InadimplenciaGauge({ taxa, totalInadimplentes, totalUnidades }: InadimplenciaGaugeProps) {
  let colorClass = 'text-green-500';
  let bgClass = 'bg-green-500';
  
  if (taxa > 30) {
    colorClass = 'text-red-500';
    bgClass = 'bg-red-500';
  } else if (taxa >= 10) {
    colorClass = 'text-amber-500';
    bgClass = 'bg-amber-500';
  }

  // Calculate SVG circle properties
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (taxa / 100) * circumference;

  return (
    <Card title="Taxa de Inadimplência" className="h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center py-4">
        <div className="relative flex items-center justify-center w-40 h-40">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-100"
            />
            {/* Progress Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`${colorClass} transition-all duration-1000 ease-out`}
            />
          </svg>
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-800">{taxa.toFixed(1)}%</span>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-800">{totalInadimplentes}</span> de <span className="font-semibold text-slate-800">{totalUnidades}</span> unidades em atraso
          </p>
        </div>
      </div>
    </Card>
  );
}
