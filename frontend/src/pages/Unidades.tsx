import React from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Plus } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { Unidade } from '../types';

export function Unidades() {
  const { data: unidades, loading, error } = useApi<Unidade[]>('/unidades');

  const columns: Column<Unidade>[] = [
    { key: 'bloco', title: 'Bloco', render: (item) => <span className="font-semibold text-slate-700">{item.bloco}</span> },
    { key: 'numero', title: 'Número' },
    { key: 'status', title: 'Status', render: (item) => <StatusBadge status={item.status as any} /> },
    { key: 'id', title: 'Moradores Registrados', render: (item) => {
      // O controller do backend precisa retornar a contagem ou array de moradores. 
      // Por segurança visual, mostramos a quantidade se o backend enviar o array de moradores.
      const qtd = item.moradores ? item.moradores.length : 0;
      return `${qtd} morador(es)`;
    } },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Unidades</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm shadow-sm">
          <Plus size={16} />
          Nova Unidade
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Carregando unidades...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Erro ao carregar os dados.</div>
        ) : (
          <DataTable columns={columns} data={unidades || []} />
        )}
      </div>
    </div>
  );
}
