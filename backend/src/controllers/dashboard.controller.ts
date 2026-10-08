import { Request, Response, NextFunction } from 'express';
import { getDashboardData } from '../services/dashboard.service.js';

export async function getDashboard(req: any, res: Response, next: NextFunction) {
  try {
    if (!req.condominiosIds || req.condominiosIds.length === 0) {
      return res.status(403).json({ error: 'Nenhum condominio vinculado' });
    }
    
    // Se não enviar ID, pega o primeiro condomínio da lista do usuário
    const condominioId = (req.query.condominioId as string) || req.condominiosIds[0];
    
    if (!condominioId || !req.condominiosIds.includes(condominioId)) {
      return res.status(403).json({ error: 'Condominio inválido ou não autorizado' });
    }
    const data = await getDashboardData(condominioId);
    res.json(data);
  } catch (error) {
    next(error);
  }
}
