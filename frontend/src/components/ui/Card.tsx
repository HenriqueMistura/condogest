import React from 'react';

interface CardProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-5 border border-slate-100 ${className}`}>
      {title && (
        <div className="mb-4">
          {typeof title === 'string' ? <h3 className="text-lg font-semibold text-slate-800">{title}</h3> : title}
        </div>
      )}
      {children}
    </div>
  );
}
