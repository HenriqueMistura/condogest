import React from 'react';

type StatusType = 'PAGO' | 'PENDENTE' | 'ATRASADO' | 'CANCELADO' | 'OCUPADO' | 'VAZIO';

interface StatusBadgeProps {
  status: StatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let bgColor = '';
  let textColor = '';

  switch (status) {
    case 'PAGO':
    case 'OCUPADO':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'PENDENTE':
      bgColor = 'bg-amber-100';
      textColor = 'text-amber-800';
      break;
    case 'ATRASADO':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    case 'CANCELADO':
    case 'VAZIO':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
}
