import React from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { Plus } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { Morador } from '../types';

export function Moradores() {
  const { data: moradores, loading, error } = useApi<Morador[]>('/moradores');

  const columns: Column<Morador>[] = [
    { key: 'nome', title: 'Nome', render: (item) => <span className="font-medium text-slate-800">{item.nome}</span> },
    { key: 'cpf', title: 'CPF' },
    { key: 'unidade', title: 'Unidade', render: (item) => item.unidade ? `Bl ${item.unidade.bloco} - Ap ${item.unidade.numero}` : '-' },
    { key: 'telefone', title: 'Telefone', render: (item) => item.telefone || '-' },
    { key: 'email', title: 'Email', render: (item) => item.email || '-' },
    { 
      key: 'ativo', 
      title: 'Status', 
      render: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.ativo ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
          {item.ativo ? 'Ativo' : 'Inativo'}
        </span>
      ) 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Moradores</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm shadow-sm">
          <Plus size={16} />
          Novo Morador
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Carregando moradores...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Erro ao carregar os dados.</div>
        ) : (
          <DataTable columns={columns} data={moradores || []} />
        )}
      </div>
    </div>
  );
}
