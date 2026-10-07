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

      const usuario = await prisma.usuario.findUnique({ where: { email } });

      if (!usuario) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const secret = process.env.JWT_SECRET || 'super_secret_condogest_key';
      
      const token = jwt.sign({ id: usuario.id, role: usuario.role }, secret, {
        expiresIn: '7d', // O login dura 7 dias
      });

      return res.json({
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role
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
        select: { id: true, nome: true, email: true, role: true }
      });
      return res.json(usuario);
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno' });
    }
  }
}

export const authController = new AuthController();
