export function calcularMultaJuros(valorOriginal: number, dataVencimento: Date) {
  const today = new Date();
  const vencimentoDate = new Date(dataVencimento);
  
  // Reseta horas para comparação exata de datas
  today.setHours(0, 0, 0, 0);
  vencimentoDate.setHours(0, 0, 0, 0);

  let diasAtraso = 0;
  
  const diffTime = today.getTime() - vencimentoDate.getTime();
  if (diffTime > 0) {
    diasAtraso = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  if (diasAtraso <= 0) {
    return {
      multa: 0,
      juros: 0,
      valorAtualizado: valorOriginal,
      diasAtraso: 0,
    };
  }

  // 2% flat de multa
  const multa = valorOriginal * 0.02;
  // 1% ao mês pro rata die
  const juros = valorOriginal * 0.01 * (diasAtraso / 30);
  const valorAtualizado = valorOriginal + multa + juros;

  return {
    multa,
    juros,
    valorAtualizado,
    diasAtraso,
  };
}
