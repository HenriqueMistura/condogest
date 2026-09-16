import { prisma } from '../lib/prisma.js';
import { calcularMultaJuros } from '../utils/calculoJuros.js';

export async function atualizarInadimplencia() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const receitasAtrasadas = await prisma.receita.findMany({
    where: {
      status: {
        in: ['PENDENTE', 'ATRASADO']
      },
      dataVencimento: {
        lt: hoje,
      },
    },
  });

  let atualizadas = 0;

  for (const receita of receitasAtrasadas) {
    const valorOriginal = Number(receita.valor);
    const result = calcularMultaJuros(valorOriginal, receita.dataVencimento);

    if (result.diasAtraso > 0) {
      await prisma.receita.update({
        where: { id: receita.id },
        data: {
          status: 'ATRASADO',
          valorAtualizado: result.valorAtualizado,
        },
      });
      atualizadas++;
    }
  }

  return atualizadas;
}
