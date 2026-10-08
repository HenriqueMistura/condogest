import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export class CondominiosController {
  async listar(req: any, res: Response) {
    try {
      // Apenas SUPER_ADMIN pode listar todos
      if (req.userRole !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const condominios = await prisma.condominio.findMany({
        include: {
          _count: {
            select: { unidades: true, moradores: true }
          }
        },
        orderBy: { nome: 'asc' }
      });

      return res.json(condominios);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar condomínios' });
    }
  }

  async criar(req: any, res: Response) {
    try {
      if (req.userRole !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const { nome, cnpj, asaasApiKey } = req.body;

      if (!nome) {
        return res.status(400).json({ error: 'Nome do condomínio é obrigatório' });
      }

      const condominio = await prisma.condominio.create({
        data: { nome, cnpj, asaasApiKey }
      });

      return res.status(201).json(condominio);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar condomínio' });
    }
  }
  async excluir(req: any, res: Response) {
    try {
      if (req.userRole !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const { id } = req.params;

      // Deletar em cascata manualmente usando transaction para evitar erro de Foreign Key
      await prisma.$transaction([
        prisma.receita.deleteMany({ where: { condominioId: id } }),
        prisma.despesa.deleteMany({ where: { condominioId: id } }),
        prisma.morador.deleteMany({ where: { condominioId: id } }),
        prisma.unidade.deleteMany({ where: { condominioId: id } }),
        prisma.condominio.delete({ where: { id } })
      ]);

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao excluir condomínio' });
    }
  }
}

export const condominiosController = new CondominiosController();
