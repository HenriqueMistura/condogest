import cron from 'node-cron';
import { atualizarInadimplencia } from '../services/inadimplencia.service.js';

export function agendarAtualizacaoInadimplencia() {
  // Executa todo dia às 06:00
  cron.schedule('0 6 * * *', async () => {
    console.log('[CRON] Iniciando atualização de inadimplência...');
    try {
      const count = await atualizarInadimplencia();
      console.log(`[CRON] ${count} receitas atualizadas com atraso.`);
    } catch (error) {
      console.error('[CRON] Erro ao atualizar inadimplência:', error);
    }
  });
}
