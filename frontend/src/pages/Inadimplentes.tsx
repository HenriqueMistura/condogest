import React, { useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { TabelaInadimplentes } from '../components/inadimplentes/TabelaInadimplentes';
import { Download } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { Receita } from '../types';

export function Inadimplentes() {
  const { data: receitas, loading, error } = useApi<Receita[]>('/receitas');

  const inadimplentesData = useMemo(() => {
    if (!receitas) return [];
    return receitas
      .filter((r) => r.status === 'ATRASADO' || r.status === 'PENDENTE' && new Date(r.dataVencimento) < new Date())
      .map((r) => ({
        id: r.id,
        condominioId: r.condominioId,
        moradorNome: r.morador?.nome || 'Desconhecido',
        unidade: r.morador?.unidade ? `${r.morador.unidade.bloco}-${r.morador.unidade.numero}` : '-',
        cpf: r.morador?.cpf || '-',
        valorOriginal: r.valor,
        valorAtualizado: r.valorAtualizado || r.valor,
        dataVencimento: r.dataVencimento,
      }));
  }, [receitas]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const totalEmAtraso = inadimplentesData.reduce((acc, curr) => acc + curr.valorAtualizado, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Gestão de Inadimplentes</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm shadow-sm">
          <Download size={16} />
          Exportar Relatório
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <p className="text-sm font-medium text-slate-500 mb-2">Total de Inadimplentes</p>
          <h3 className="text-3xl font-bold text-slate-800">
            {loading ? '...' : inadimplentesData.length}
          </h3>
          <p className="text-sm text-slate-400 mt-1">moradores com pendências</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-slate-500 mb-2">Valor Total em Atraso</p>
          <h3 className="text-3xl font-bold text-red-600">
            {loading ? '...' : formatCurrency(totalEmAtraso)}
          </h3>
          <p className="text-sm text-slate-400 mt-1">já com juros e multas calculados</p>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Lista de Devedores</h3>
        {loading ? (
          <div className="p-8 text-center text-slate-500 bg-white rounded-xl shadow-sm">Carregando inadimplentes...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 bg-white rounded-xl shadow-sm">Erro ao carregar os dados.</div>
        ) : (
          <TabelaInadimplentes data={inadimplentesData} />
        )}
      </div>
    </div>
  );
}
