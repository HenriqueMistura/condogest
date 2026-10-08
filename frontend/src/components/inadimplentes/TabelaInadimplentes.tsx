import React from 'react';
import { DataTable, Column } from '../ui/DataTable';
import { BotaoReenvio } from './BotaoReenvio';
import { CondominioTag } from '../ui/CondominioTag';

interface Inadimplente {
  id: string;
  condominioId: string;
  moradorNome: string;
  unidade: string;
  cpf: string;
  valorOriginal: number;
  valorAtualizado: number;
  dataVencimento: string;
}

interface TabelaInadimplentesProps {
  data: Inadimplente[];
}

export function TabelaInadimplentes({ data }: TabelaInadimplentesProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const getDiasAtraso = (dataVenc: string) => {
    const today = new Date();
    const vencimento = new Date(dataVenc);
    const diffTime = Math.abs(today.getTime() - vencimento.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const totalValorAtualizado = data.reduce((acc, curr) => acc + curr.valorAtualizado, 0);
  const totalValorOriginal = data.reduce((acc, curr) => acc + curr.valorOriginal, 0);

  const columns: Column<Inadimplente>[] = [
    {
      key: 'etapa',
      title: 'Etapa',
      render: (item) => <CondominioTag condominioId={item.condominioId} />,
    },
    {
      key: 'morador',
      title: 'Morador',
      render: (item) => <span className="font-medium text-slate-800">{item.moradorNome}</span>,
    },
    { key: 'unidade', title: 'Unidade' },
    { key: 'cpf', title: 'CPF' },
    {
      key: 'valorOriginal',
      title: 'Valor Original',
      render: (item) => formatCurrency(item.valorOriginal),
    },
    {
      key: 'valorAtualizado',
      title: 'Valor Atualizado',
      render: (item) => <span className="font-semibold text-red-600">{formatCurrency(item.valorAtualizado)}</span>,
    },
    {
      key: 'diasAtraso',
      title: 'Dias em Atraso',
      render: (item) => `${getDiasAtraso(item.dataVencimento)} dias`,
    },
    {
      key: 'acoes',
      title: 'Ações',
      render: (item) => <BotaoReenvio id={item.id} nome={item.moradorNome} />,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <DataTable columns={columns} data={data} />
      {data.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between items-center px-6">
          <span className="font-semibold text-slate-700">Total</span>
          <div className="flex gap-12 text-sm">
            <div>
              <span className="text-slate-500 mr-2">Original:</span>
              <span className="font-medium">{formatCurrency(totalValorOriginal)}</span>
            </div>
            <div>
              <span className="text-slate-500 mr-2">Atualizado:</span>
              <span className="font-bold text-red-600">{formatCurrency(totalValorAtualizado)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
