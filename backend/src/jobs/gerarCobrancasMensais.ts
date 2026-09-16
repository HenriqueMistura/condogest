import cron from 'node-cron';
import { gerarCobrancasMensais } from '../services/cobranca.service.js';

export function agendarGerarCobrancas() {
  // Executa todo dia 10 de cada mês às 08:00
  cron.schedule('0 8 10 * *', async () => {
    console.log('[CRON] Iniciando geração de cobranças mensais...');
    try {
      const count = await gerarCobrancasMensais();
      console.log(`[CRON] ${count} cobranças geradas com sucesso.`);
    } catch (error) {
      console.error('[CRON] Erro ao gerar cobranças mensais:', error);
    }
  });
}
