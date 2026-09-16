import axios from 'axios';

const api = axios.create({
  baseURL: process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3',
});

// Interceptor to inject API Key dynamically
api.interceptors.request.use((config) => {
  const token = process.env.ASAAS_API_KEY;
  if (token) {
    config.headers['access_token'] = token;
  }
  return config;
});

interface AsaasCustomerPayload {
  name: string;
  cpfCnpj: string;
  email?: string;
  phone?: string;
  mobilePhone?: string;
}

interface AsaasChargePayload {
  customer: string; // Asaas Customer ID
  billingType: 'BOLETO' | 'PIX' | 'CREDIT_CARD';
  value: number;
  dueDate: string; // YYYY-MM-DD
  description: string;
}

export const asaasService = {
  /**
   * Cria ou recupera um cliente no Asaas
   */
  async criarCliente(payload: AsaasCustomerPayload): Promise<string> {
    try {
      // Primeiro, verifica se o cliente já existe no Asaas pelo CPF
      const searchRes = await api.get('/customers', { params: { cpfCnpj: payload.cpfCnpj } });
      if (searchRes.data.data && searchRes.data.data.length > 0) {
        return searchRes.data.data[0].id;
      }

      // Se não existir, cria um novo
      const res = await api.post('/customers', payload);
      return res.data.id;
    } catch (error: any) {
      console.error('Erro ao criar cliente no Asaas:', error.response?.data || error.message);
      throw new Error('Falha na integração com Asaas (Customer)');
    }
  },

  /**
   * Gera uma nova cobrança (Boleto/Pix) já com as regras de multa (2%) e juros (1% a.m.) configuradas
   */
  async criarCobranca(payload: AsaasChargePayload) {
    try {
      const res = await api.post('/payments', {
        ...payload,
        fine: {
          value: 2 // 2% de multa fixa por atraso
        },
        interest: {
          value: 1 // 1% de juros ao mês pro rata die
        }
      });
      
      return {
        id: res.data.id, // ID da transação no Asaas (transacaoIdApi)
        invoiceUrl: res.data.invoiceUrl, // Link do boleto gerado
        bankSlipUrl: res.data.bankSlipUrl, // PDF direto do boleto
        invoiceNumber: res.data.invoiceNumber
      };
    } catch (error: any) {
      console.error('Erro ao criar cobrança no Asaas:', error.response?.data || error.message);
      throw new Error('Falha na integração com Asaas (Payment)');
    }
  }
};
