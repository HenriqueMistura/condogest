import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { gerarCobrancasMensais } from '../services/cobranca.service.js';
import { z } from 'zod';
import { StatusReceita, TipoReceita } from '@prisma/client';

const receitaSchema = z.object({
  moradorId: z.string().uuid(),
  valor: z.number().positive(),
  dataVencimento: z.string().transform(str => new Date(str)),
  dataPagamento: z.string().transform(str => new Date(str)).nullable().optional(),
  status: z.nativeEnum(StatusReceita).optional(),
  tipo: z.nativeEnum(TipoReceita),
  linkFatura: z.string().nullable().optional(),
});

export async function list(req: any, res: Response, next: NextFunction) {
  try {
    if (!req.condominiosIds || req.condominiosIds.length === 0) return res.status(403).json({ error: 'Nenhum condominio vinculado' });
    const { status, tipo, mes, ano } = req.query;
    
    let filter: any = { condominioId: { in: req.condominiosIds } };
    if (status) filter.status = status;
    if (tipo) filter.tipo = tipo;

    if (mes && ano) {
      const start = new Date(Number(ano), Number(mes) - 1, 1);
      const end = new Date(Number(ano), Number(mes), 0);
      filter.dataVencimento = { gte: start, lte: end };
    }

    const receitas = await prisma.receita.findMany({
      where: filter,
      include: {
        morador: {
          include: { unidade: true }
        }
      }
    });
    res.json(receitas);
  } catch (error) {
    next(error);
  }
}

export async function get(req: any, res: Response, next: NextFunction) {
  try {
    if (!req.condominiosIds || req.condominiosIds.length === 0) return res.status(403).json({ error: 'Nenhum condominio vinculado' });
    const receita = await prisma.receita.findFirst({
      where: { id: req.params.id, condominioId: { in: req.condominiosIds } },
      include: { morador: true }
    });
    if (!receita) {
      return res.status(404).json({ error: 'Receita não encontrada' });
    }
    res.json(receita);
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
    const data = receitaSchema.parse(req.body);
    const receita = await prisma.receita.create({ data: { ...data, condominioId } });
    res.status(201).json(receita);
  } catch (error) {
    next(error);
  }
}

export async function gerarLote(req: any, res: Response, next: NextFunction) {
  try {
    if (!req.condominiosIds || req.condominiosIds.length === 0) return res.status(403).json({ error: 'Nenhum condominio vinculado' });
    const { condominioId } = req.body;
    if (!condominioId || !req.condominiosIds.includes(condominioId)) {
      return res.status(403).json({ error: 'Condominio inválido ou não autorizado' });
    }
    const count = await gerarCobrancasMensais(condominioId);
    res.json({ message: `${count} cobranças geradas com sucesso.` });
  } catch (error) {
    next(error);
  }
}
