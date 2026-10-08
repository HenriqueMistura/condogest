import { prisma } from '../lib/prisma.js';
import { asaasService } from './asaas.service.js';

export async function gerarCobrancasMensais(condominioId: string) {
  const unidades = await prisma.unidade.findMany({
    where: {
      status: 'OCUPADO',
      condominioId,
    },
    include: {
      moradores: {
        where: {
          ativo: true,
        },
      },
    },
  });

  let cobrancasGeradas = 0;
  const hoje = new Date();
  
  // Vencimento no dia 10 do mês atual
  const dataVencimento = new Date(hoje.getFullYear(), hoje.getMonth(), 10);
  
  if (hoje.getDate() > 10) {
    dataVencimento.setMonth(dataVencimento.getMonth() + 1);
  }
  
  const vencimentoString = dataVencimento.toISOString().split('T')[0]; // YYYY-MM-DD para o Asaas

  for (const unidade of unidades) {
    const morador = unidade.moradores[0];
    
    if (morador) {
      const inicioMes = new Date(dataVencimento.getFullYear(), dataVencimento.getMonth(), 1);
      const fimMes = new Date(dataVencimento.getFullYear(), dataVencimento.getMonth() + 1, 0);

      const receitaExistente = await prisma.receita.findFirst({
        where: {
          moradorId: morador.id,
          tipo: 'TAXA_CONDOMINIAL',
          dataVencimento: {
            gte: inicioMes,
            lte: fimMes,
          },
        },
      });

      if (!receitaExistente) {
        try {
          let asaasId = morador.asaasId;

          // 1. Se o morador não tem ID do Asaas, cadastra ele lá primeiro
          if (!asaasId) {
            asaasId = await asaasService.criarCliente({
              name: morador.nome,
              cpfCnpj: morador.cpf,
              email: morador.email || undefined,
              mobilePhone: morador.telefone || undefined,
            });

            await prisma.morador.update({
              where: { id: morador.id },
              data: { asaasId }
            });
          }

          // 2. Gera a cobrança no Asaas
          const cobrancaAsaas = await asaasService.criarCobranca({
            customer: asaasId,
            billingType: 'BOLETO', // Pode ser alterado para PIX futuramente
            value: 500.00,
            dueDate: vencimentoString,
            description: `Taxa Condominial - Unidade ${unidade.bloco}-${unidade.numero}`
          });

          // 3. Salva no nosso banco de dados
          await prisma.receita.create({
            data: {
              condominioId,
              moradorId: morador.id,
              valor: 500.00,
              tipo: 'TAXA_CONDOMINIAL',
              dataVencimento,
              status: 'PENDENTE',
              transacaoIdApi: cobrancaAsaas.id,     // ID único do Asaas
              linkFatura: cobrancaAsaas.invoiceUrl  // Link do boleto pronto
            },
          });
          
          cobrancasGeradas++;
        } catch (err: any) {
          console.error(`Falha ao gerar cobrança para unidade ${unidade.bloco}-${unidade.numero}:`, err.message);
          // Continua para o próximo morador mesmo se um falhar
        }
      }
    }
  }

  return cobrancasGeradas;
}
