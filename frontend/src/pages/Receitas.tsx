import React, { useState } from 'react';
import { DataTable, Column } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { FilePlus } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { Receita } from '../types';
import { api } from '../services/api';
import { CondominioTag } from '../components/ui/CondominioTag';
import { useAuth } from '../contexts/AuthContext';

export function Receitas() {
  const [gerando, setGerando] = useState(false);
  const { data: receitas, loading, error, refetch } = useApi<Receita[]>('/receitas');
  const { usuario } = useAuth();

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' }); 
  };

  const handleGerarEmLote = async () => {
    // Se o usuário gerencia múltiplos, precisamos de um modal pra escolher qual.
    // Como simplificação inicial, passamos o primeiro ou pedimos por select se houver mais de 1
    const condominios = usuario?.condominios || [];
    if (condominios.length === 0) return alert('Você não gerencia nenhum condomínio.');

    let targetCondominioId = condominios[0].id;
    
    if (condominios.length > 1) {
      const options = condominios.map((c, i) => `${i + 1} - ${c.nome}`).join('\n');
      const response = prompt(`Você gerencia várias etapas. Digite o NÚMERO da etapa para gerar os boletos:\n${options}`);
      if (!response) return;
      const index = parseInt(response) - 1;
      if (index >= 0 && index < condominios.length) {
        targetCondominioId = condominios[index].id;
      } else {
        return alert('Seleção inválida.');
      }
    }

    if (confirm('Deseja realmente gerar as cobranças em lote para todas as unidades ocupadas desta etapa?')) {
      setGerando(true);
      try {
        await api.post('/receitas/gerar-lote', { condominioId: targetCondominioId });
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
    { key: 'etapa', title: 'Etapa', render: (item) => <CondominioTag condominioId={item.condominioId} /> },
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
