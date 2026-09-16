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

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const moradores = await prisma.morador.findMany({
      include: {
        unidade: true,
      }
    });
    res.json(moradores);
  } catch (error) {
    next(error);
  }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const morador = await prisma.morador.findUnique({
      where: { id: req.params.id },
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

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = moradorSchema.parse(req.body);
    const morador = await prisma.morador.create({ data });
    res.status(201).json(morador);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const data = moradorSchema.partial().parse(req.body);
    const morador = await prisma.morador.update({
      where: { id: req.params.id },
      data
    });
    res.json(morador);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await prisma.morador.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
