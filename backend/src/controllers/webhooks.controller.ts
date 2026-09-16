import { Request, Response, NextFunction } from 'express';
import { processarPagamento } from '../services/webhook.service.js';
import { z } from 'zod';

const webhookPayloadSchema = z.object({
  transacaoId: z.string(),
  valor: z.number().positive(),
  dataPagamento: z.string(),
});

export async function pagamento(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = webhookPayloadSchema.parse(req.body);
    const result = await processarPagamento(payload);
    res.json({ message: 'Pagamento processado com sucesso', result });
  } catch (error) {
    next(error);
  }
}
