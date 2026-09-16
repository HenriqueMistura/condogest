import React from 'react';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { InadimplenciaGauge } from '../components/dashboard/InadimplenciaGauge';
import { TransacoesRecentes } from '../components/dashboard/TransacoesRecentes';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { DashboardData } from '../types';

export function Dashboard() {
  const { data: dashboard, loading, error } = useApi<DashboardData>('/dashboard');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Carregando painel...</div>;
  }

  if (error || !dashboard) {
    return <div className="flex items-center justify-center h-64 text-red-500">Erro ao carregar o painel.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Receita Prevista (Mês)"
          value={formatCurrency(dashboard.receitaPrevista)}
          icon={DollarSign}
          colorVariant="blue"
        />
        <SummaryCard
          title="Receita Arrecadada"
          value={formatCurrency(dashboard.receitaArrecadada)}
          icon={TrendingUp}
          colorVariant="green"
        />
        <SummaryCard
          title="Despesas do Mês"
          value={formatCurrency(dashboard.despesasMes)}
          icon={TrendingDown}
          colorVariant="red"
        />
        <SummaryCard
          title="Saldo Atual"
          value={formatCurrency(dashboard.saldo)}
          icon={Wallet}
          colorVariant="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <InadimplenciaGauge 
            taxa={dashboard.taxaInadimplencia} 
            totalInadimplentes={dashboard.totalInadimplentes} 
            totalUnidades={dashboard.totalUnidades} 
          />
        </div>
        <div className="lg:col-span-2">
          <TransacoesRecentes transacoes={dashboard.ultimasTransacoes as any} />
        </div>
      </div>
    </div>
  );
}
