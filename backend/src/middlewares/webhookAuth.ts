import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export function webhookAuth(req: Request, res: Response, next: NextFunction) {
  const signature = req.headers['x-webhook-signature'] as string;
  const secret = process.env.WEBHOOK_SECRET;

  if (!secret) {
    console.error('WEBHOOK_SECRET não configurado.');
    return res.status(500).json({ error: 'Erro de configuração do servidor' });
  }

  if (!signature) {
    return res.status(401).json({ error: 'Assinatura ausente' });
  }

  const payload = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Assinatura inválida' });
  }

  next();
}
