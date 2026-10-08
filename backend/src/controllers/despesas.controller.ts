import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';
import { StatusDespesa } from '@prisma/client';

const despesaSchema = z.object({
  descricao: z.string(),
  valor: z.number().positive(),
  dataVencimento: z.string().transform(str => new Date(str)),
  dataPagamento: z.string().transform(str => new Date(str)).nullable().optional(),
  status: z.nativeEnum(StatusDespesa).optional(),
  fornecedor: z.string(),
});

export async function list(req: any, res: Response, next: NextFunction) {
  try {
    if (!req.condominiosIds || req.condominiosIds.length === 0) return res.status(403).json({ error: 'Nenhum condominio vinculado' });
    const despesas = await prisma.despesa.findMany({
      where: { condominioId: { in: req.condominiosIds } }
    });
    res.json(despesas);
  } catch (error) {
    next(error);
  }
}

export async function get(req: any, res: Response, next: NextFunction) {
  try {
    if (!req.condominiosIds || req.condominiosIds.length === 0) return res.status(403).json({ error: 'Nenhum condominio vinculado' });
    const despesa = await prisma.despesa.findFirst({
      where: { id: req.params.id, condominioId: { in: req.condominiosIds } }
    });
    if (!despesa) {
      return res.status(404).json({ error: 'Despesa não encontrada' });
    }
    res.json(despesa);
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
    const data = despesaSchema.parse(req.body);
    const despesa = await prisma.despesa.create({ data: { ...data, condominioId } });
    res.status(201).json(despesa);
  } catch (error) {
    next(error);
  }
}

export async function update(req: any, res: Response, next: NextFunction) {
  try {
    if (!req.condominiosIds || req.condominiosIds.length === 0) return res.status(403).json({ error: 'Nenhum condominio vinculado' });
    const data = despesaSchema.partial().parse(req.body);

    const existing = await prisma.despesa.findFirst({ where: { id: req.params.id, condominioId: { in: req.condominiosIds } } });
    if (!existing) return res.status(404).json({ error: 'Despesa não encontrada' });

    const despesa = await prisma.despesa.update({
      where: { id: req.params.id },
      data
    });
    res.json(despesa);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: any, res: Response, next: NextFunction) {
  try {
    if (!req.condominiosIds || req.condominiosIds.length === 0) return res.status(403).json({ error: 'Nenhum condominio vinculado' });
    const existing = await prisma.despesa.findFirst({ where: { id: req.params.id, condominioId: { in: req.condominiosIds } } });
    if (!existing) return res.status(404).json({ error: 'Despesa não encontrada' });

    await prisma.despesa.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
