import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const unidadeSchema = z.object({
  bloco: z.string(),
  numero: z.string(),
  status: z.enum(['OCUPADO', 'VAZIO']).optional(),
});

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const unidades = await prisma.unidade.findMany({
      include: {
        moradores: true,
      }
    });
    res.json(unidades);
  } catch (error) {
    next(error);
  }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const unidade = await prisma.unidade.findUnique({
      where: { id: req.params.id },
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

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = unidadeSchema.parse(req.body);
    const unidade = await prisma.unidade.create({ data });
    res.status(201).json(unidade);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const data = unidadeSchema.partial().parse(req.body);
    const unidade = await prisma.unidade.update({
      where: { id: req.params.id },
      data
    });
    res.json(unidade);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await prisma.unidade.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
