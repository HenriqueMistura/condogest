import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const unidadeSchema = z.object({
  bloco: z.string(),
  numero: z.string(),
  status: z.enum(['OCUPADO', 'VAZIO']).optional(),
});

export async function list(req: any, res: Response, next: NextFunction) {
  try {
    if (!req.condominiosIds || req.condominiosIds.length === 0) return res.status(403).json({ error: 'Nenhum condominio vinculado' });
    const unidades = await prisma.unidade.findMany({
      where: { condominioId: { in: req.condominiosIds } },
      include: {
        moradores: true,
      }
    });
    res.json(unidades);
  } catch (error) {
    next(error);
  }
}

export async function get(req: any, res: Response, next: NextFunction) {
  try {
    if (!req.condominiosIds || req.condominiosIds.length === 0) return res.status(403).json({ error: 'Nenhum condominio vinculado' });
    const unidade = await prisma.unidade.findFirst({
      where: { id: req.params.id, condominioId: { in: req.condominiosIds } },
      include: { moradores: true }
    });
    if (!unidade) {
      return res.status(404).json({ error: 'Unidade não encontrada' });
    }
    res.json(unidade);
  } catch (error) {
    next(error);
  }
}

export async function create(req: any, res: Response, next: NextFunction) {
  try {
    if (!req.condominiosIds || req.condominiosIds.length === 0) return res.status(403).json({ error: 'Nenhum condominio vinculado' });
    const { condominioId } = req.body;
    if (!condominioId || !req.condominiosIds.includes(condominioId)) {
      return res.status(403).json({ error: 'Condominio inválido ou não autorizado' });
    }
    const data = unidadeSchema.parse(req.body);
    const unidade = await prisma.unidade.create({ data: { ...data, condominioId } });
    res.status(201).json(unidade);
  } catch (error) {
    next(error);
  }
}

export async function update(req: any, res: Response, next: NextFunction) {
  try {
    if (!req.condominiosIds || req.condominiosIds.length === 0) return res.status(403).json({ error: 'Nenhum condominio vinculado' });
    const data = unidadeSchema.partial().parse(req.body);
    
    const existing = await prisma.unidade.findFirst({ where: { id: req.params.id, condominioId: { in: req.condominiosIds } } });
    if (!existing) return res.status(404).json({ error: 'Unidade não encontrada' });

    const unidade = await prisma.unidade.update({
      where: { id: req.params.id },
      data
    });
    res.json(unidade);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: any, res: Response, next: NextFunction) {
  try {
    if (!req.condominiosIds || req.condominiosIds.length === 0) return res.status(403).json({ error: 'Nenhum condominio vinculado' });
    const existing = await prisma.unidade.findFirst({ where: { id: req.params.id, condominioId: { in: req.condominiosIds } } });
    if (!existing) return res.status(404).json({ error: 'Unidade não encontrada' });
    
    await prisma.unidade.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
