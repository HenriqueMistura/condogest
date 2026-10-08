import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const usuario = await prisma.usuario.findUnique({ 
        where: { email },
        include: { condominios: true }
      });

      if (!usuario) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const secret = process.env.JWT_SECRET || 'super_secret_condogest_key';
      
      const condominiosIds = usuario.condominios.map(c => c.id);

      const token = jwt.sign({ id: usuario.id, role: usuario.role, condominiosIds }, secret, {
        expiresIn: '7d', // O login dura 7 dias
      });

      return res.json({
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role,
          condominiosIds,
          condominios: usuario.condominios
        },
        token
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async me(req: any, res: Response) {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: req.userId },
        select: { id: true, nome: true, email: true, role: true, condominios: true }
      });
      if (usuario) {
        return res.json({
          ...usuario,
          condominiosIds: usuario.condominios.map(c => c.id)
        });
      }
      return res.json(usuario);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno' });
    }
  }

  async impersonate(req: any, res: Response) {
    try {
      if (req.userRole !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Acesso negado. Apenas SUPER_ADMIN pode usar essa função.' });
      }

      const { condominioId } = req.params;

      const condominio = await prisma.condominio.findUnique({
        where: { id: condominioId }
      });

      if (!condominio) {
        return res.status(404).json({ error: 'Condomínio não encontrado' });
      }

      const usuario = await prisma.usuario.findUnique({
        where: { id: req.userId }
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const secret = process.env.JWT_SECRET || 'super_secret_condogest_key';
      
      // Criar token falso dizendo que ele é SINDICO desse condomínio específico
      const token = jwt.sign({ 
        id: usuario.id, 
        role: 'SINDICO', 
        condominiosIds: [condominioId],
        isImpersonating: true 
      }, secret, {
        expiresIn: '2h', // Token temporário
      });

      return res.json({
        usuario: {
          id: usuario.id,
          nome: `${usuario.nome} (Acesso: ${condominio.nome})`,
          email: usuario.email,
          role: 'SINDICO',
          condominiosIds: [condominioId],
          condominios: [condominio]
        },
        token
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export const authController = new AuthController();
