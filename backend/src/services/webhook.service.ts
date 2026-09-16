import { prisma } from '../lib/prisma.js';

interface AsaasWebhookPayload {
  event: string;
  payment: {
    id: string; // Ex: pay_123456
    value: number;
    netValue: number;
    paymentDate: string; // YYYY-MM-DD
    status: string;
  };
}

export async function processarPagamento(payload: AsaasWebhookPayload) {
  // O Asaas manda vários eventos, mas só nos importamos com quando a pessoa paga de fato
  if (payload.event !== 'PAYMENT_RECEIVED' && payload.event !== 'PAYMENT_CONFIRMED') {
    return null; // Ignora outros eventos (ex: boleto visualizado, atrasado)
  }

  const transacaoId = payload.payment.id;

  const receita = await prisma.receita.findUnique({
    where: {
      transacaoIdApi: transacaoId,
    },
  });

  if (!receita) {
    throw new Error('Receita não encontrada para o transacaoId enviado pelo Asaas.');
  }

  const updated = await prisma.receita.update({
    where: { id: receita.id },
    data: {
      status: 'PAGO',
      dataPagamento: new Date(payload.payment.paymentDate),
      valorAtualizado: payload.payment.value, // Pode ser maior que o original se teve multa
    },
  });

  return updated;
}
