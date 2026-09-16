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

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const despesas = await prisma.despesa.findMany();
    res.json(despesas);
  } catch (error) {
    next(error);
  }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const despesa = await prisma.despesa.findUnique({
      where: { id: req.params.id }
    });
    if (!despesa) {
      return res.status(404).json({ error: 'Despesa não encontrada' });
    }
    res.json(despesa);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = despesaSchema.parse(req.body);
    const despesa = await prisma.despesa.create({ data });
    res.status(201).json(despesa);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const data = despesaSchema.partial().parse(req.body);
    const despesa = await prisma.despesa.update({
      where: { id: req.params.id },
      data
    });
    res.json(despesa);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await prisma.despesa.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
