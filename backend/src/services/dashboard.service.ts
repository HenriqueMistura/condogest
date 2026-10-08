import { prisma } from '../lib/prisma.js';

export async function getDashboardData(condominioId: string) {
  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

  // Calcula receita prevista (todas do mês)
  const todasReceitasMes = await prisma.receita.findMany({
    where: {
      condominioId,
      dataVencimento: {
        gte: inicioMes,
        lte: fimMes,
      },
    },
  });

  const receitaPrevista = todasReceitasMes.reduce((acc, curr) => acc + Number(curr.valor), 0);

  // Calcula receita arrecadada (pagas do mês)
  const receitasPagasMes = todasReceitasMes.filter(r => r.status === 'PAGO');
  const receitaArrecadada = receitasPagasMes.reduce((acc, curr) => acc + Number(curr.valorAtualizado || curr.valor), 0);

  // Calcula despesas do mês
  const despesasMesData = await prisma.despesa.findMany({
    where: {
      condominioId,
      dataVencimento: {
        gte: inicioMes,
        lte: fimMes,
      },
    },
  });
  
  const despesasMes = despesasMesData.reduce((acc, curr) => acc + Number(curr.valor), 0);

  // Saldo
  const saldo = receitaArrecadada - despesasMes;

  // Taxa de inadimplência geral
  const totalReceitas = await prisma.receita.count({ where: { condominioId } });
  const totalAtrasadas = await prisma.receita.count({
    where: { status: 'ATRASADO', condominioId }
  });
  
  const taxaInadimplencia = totalReceitas > 0 ? (totalAtrasadas / totalReceitas) * 100 : 0;

  // Últimas 10 transações (receitas)
  const ultimasTransacoes = await prisma.receita.findMany({
    where: { condominioId },
    take: 10,
    orderBy: {
      updatedAt: 'desc',
    },
    include: {
      morador: {
        include: {
          unidade: true,
        },
      },
    },
  });

  // Contagens para o Gauge
  const totalUnidades = await prisma.unidade.count({ where: { condominioId } });
  
  // Total inadimplentes (distinct moradorId com receitas ATRASADO)
  const inadimplentesResult = await prisma.receita.findMany({
    where: { status: 'ATRASADO', condominioId },
    select: { moradorId: true },
    distinct: ['moradorId'],
  });
  const totalInadimplentes = inadimplentesResult.length;

  return {
    receitaPrevista,
    receitaArrecadada,
    despesasMes,
    saldo,
    taxaInadimplencia,
    totalUnidades,
    totalInadimplentes,
    ultimasTransacoes,
  };
}
