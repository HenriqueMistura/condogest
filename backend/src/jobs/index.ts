import { agendarGerarCobrancas } from './gerarCobrancasMensais.js';
import { agendarAtualizacaoInadimplencia } from './atualizarInadimplencia.js';

export function startCronJobs() {
  agendarGerarCobrancas();
  agendarAtualizacaoInadimplencia();
  console.log('Cron jobs iniciados.');
}
