export type StatusUnidade = 'OCUPADO' | 'VAZIO';
export type StatusReceita = 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'CANCELADO';
export type TipoReceita = 'TAXA_CONDOMINIAL' | 'MULTA' | 'RESERVA_AREA';
export type StatusDespesa = 'PENDENTE' | 'PAGO';

export interface Condominio {
  id: string;
  nome: string;
  cnpj?: string;
  asaasApiKey?: string;
  corIdentificacao: string;
  ativo: boolean;
  _count?: {
    unidades: number;
    moradores: number;
  };
}

export interface Unidade {
  id: string;
  condominioId: string;
  bloco: string;
  numero: string;
  status: StatusUnidade;
  moradores?: Morador[];
}

export interface Morador {
  id: string;
  condominioId: string;
  unidadeId: string;
  nome: string;
  cpf: string;
  telefone?: string;
  email?: string;
  ativo: boolean;
  unidade?: Unidade;
  receitas?: Receita[];
}

export interface Receita {
  id: string;
  condominioId: string;
  moradorId: string;
  valor: number;
  valorAtualizado?: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: StatusReceita;
  tipo: TipoReceita;
  linkFatura?: string;
  transacaoIdApi?: string;
  morador?: Morador;
}

export interface Despesa {
  id: string;
  condominioId: string;
  descricao: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: StatusDespesa;
  fornecedor: string;
}

export interface DashboardData {
  receitaPrevista: number;
  receitaArrecadada: number;
  despesasMes: number;
  saldo: number;
  taxaInadimplencia: number;
  totalUnidades: number;
  totalInadimplentes: number;
  ultimasTransacoes: (Receita & { morador: Morador & { unidade: Unidade } })[];
}
