import React from 'react';
import { Card } from '../ui/Card';
import { DataTable, Column } from '../ui/DataTable';
import { StatusBadge } from '../ui/StatusBadge';
import { Link } from 'react-router-dom';

interface Transacao {
  id: string;
  morador: { nome: string; unidade: { bloco: string; numero: string } };
  valor: number;
  dataVencimento: string;
  status: any;
}

interface TransacoesRecentesProps {
  transacoes: Transacao[];
}

export function TransacoesRecentes({ transacoes }: TransacoesRecentesProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR');
  };

  const columns: Column<Transacao>[] = [
    {
      key: 'morador',
      title: 'Morador',
      render: (item) => <span className="font-medium text-slate-800">{item.morador.nome}</span>,
    },
    {
      key: 'unidade',
      title: 'Unidade',
      render: (item) => `${item.morador.unidade.bloco}-${item.morador.unidade.numero}`,
    },
    {
      key: 'valor',
      title: 'Valor',
      render: (item) => formatCurrency(item.valor),
    },
    {
      key: 'vencimento',
      title: 'Vencimento',
      render: (item) => formatDate(item.dataVencimento),
    },
    {
      key: 'status',
      title: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <Card title="Últimas Transações" className="h-full flex flex-col">
      <div className="flex-1 -mx-5 -mb-5">
        <DataTable columns={columns} data={transacoes} />
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl text-center">
          <Link to="/receitas" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            Ver todas as transações
          </Link>
        </div>
      </div>
    </Card>
  );
}
