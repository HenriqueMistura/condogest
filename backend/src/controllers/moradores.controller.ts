import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const moradorSchema = z.object({
  unidadeId: z.string().uuid(),
  nome: z.string(),
  cpf: z.string(),
  telefone: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  ativo: z.boolean().optional(),
});

export async function list(req: any, res: Response, next: NextFunction) {
  try {
    if (!req.condominiosIds || req.condominiosIds.length === 0) return res.status(403).json({ error: 'Nenhum condominio vinculado' });
    const moradores = await prisma.morador.findMany({
      where: { condominioId: { in: req.condominiosIds } },
      include: {
        unidade: true,
      }
    });
    res.json(moradores);
  } catch (error) {
    next(error);
  }
}

export async function get(req: any, res: Response, next: NextFunction) {
  try {
    if (!req.condominiosIds || req.condominiosIds.length === 0) return res.status(403).json({ error: 'Nenhum condominio vinculado' });
    const morador = await prisma.morador.findFirst({
      where: { id: req.params.id, condominioId: { in: req.condominiosIds } },
      include: { unidade: true }
    });
    if (!morador) {
      return res.status(404).json({ error: 'Morador não encontrado' });
    }
    res.json(morador);
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
    const data = moradorSchema.parse(req.body);
    const morador = await prisma.morador.create({ data: { ...data, condominioId } });
    res.status(201).json(morador);
  } catch (error) {
    next(error);
  }
}

export async function update(req: any, res: Response, next: NextFunction) {
  try {
    if (!req.condominiosIds || req.condominiosIds.length === 0) return res.status(403).json({ error: 'Nenhum condominio vinculado' });
    const data = moradorSchema.partial().parse(req.body);
    
    // First find if it exists and user has access
    const existing = await prisma.morador.findFirst({ where: { id: req.params.id, condominioId: { in: req.condominiosIds } } });
    if (!existing) return res.status(404).json({ error: 'Morador não encontrado' });
    
    const morador = await prisma.morador.update({
      where: { id: req.params.id },
      data
    });
    res.json(morador);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: any, res: Response, next: NextFunction) {
  try {
    if (!req.condominiosIds || req.condominiosIds.length === 0) return res.status(403).json({ error: 'Nenhum condominio vinculado' });
    const existing = await prisma.morador.findFirst({ where: { id: req.params.id, condominioId: { in: req.condominiosIds } } });
    if (!existing) return res.status(404).json({ error: 'Morador não encontrado' });
    
    await prisma.morador.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
