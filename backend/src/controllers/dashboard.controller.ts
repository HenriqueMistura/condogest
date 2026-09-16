import { Request, Response, NextFunction } from 'express';
import { getDashboardData } from '../services/dashboard.service.js';

export async function getDashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getDashboardData();
    res.json(data);
  } catch (error) {
    next(error);
  }
}
