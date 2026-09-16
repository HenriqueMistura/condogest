import React, { useState } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { FilePlus } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { Receita } from '../types';
import { api } from '../services/api';

export function Receitas() {
  const [gerando, setGerando] = useState(false);
  const { data: receitas, loading, error, refetch } = useApi<Receita[]>('/receitas');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    // Format YYYY-MM-DD to DD/MM/YYYY
    const d = new Date(dateStr);
    // Add timezone offset correction if necessary, but simple toLocaleDateString works for now
    return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' }); 
  };

  const handleGerarEmLote = async () => {
    if (confirm('Deseja realmente gerar as cobranças em lote para todas as unidades ocupadas?')) {
      setGerando(true);
      try {
        await api.post('/receitas/gerar-lote', {});
        alert('Cobranças geradas com sucesso!');
        refetch();
      } catch (err) {
        alert('Erro ao gerar cobranças.');
      } finally {
        setGerando(false);
      }
    }
  };

  const columns: Column<Receita>[] = [
    { key: 'moradorId', title: 'Morador', render: (item) => <span className="font-medium text-slate-800">{item.morador?.nome || '-'}</span> },
    { key: 'tipo', title: 'Tipo' },
    { key: 'valor', title: 'Valor Original', render: (item) => formatCurrency(item.valor) },
    { key: 'valorAtualizado', title: 'Valor Atualizado', render: (item) => item.valorAtualizado ? formatCurrency(item.valorAtualizado) : '-' },
    { key: 'dataVencimento', title: 'Vencimento', render: (item) => formatDate(item.dataVencimento) },
    { key: 'dataPagamento', title: 'Pagamento', render: (item) => formatDate(item.dataPagamento) },
    { key: 'status', title: 'Status', render: (item) => <StatusBadge status={item.status} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Receitas (Boletos/Cobranças)</h2>
        <button 
          onClick={handleGerarEmLote}
          disabled={gerando}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm shadow-sm disabled:opacity-50"
        >
          <FilePlus size={16} />
          {gerando ? 'Gerando...' : 'Gerar Cobranças em Lote'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Carregando receitas...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Erro ao carregar os dados.</div>
        ) : (
          <DataTable columns={columns} data={receitas || []} />
        )}
      </div>
    </div>
  );
}
