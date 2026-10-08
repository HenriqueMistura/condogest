import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  userId?: string;
  condominiosIds?: string[];
  userRole?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Token error' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token mal formatado' });
  }

  const secret = process.env.JWT_SECRET || 'super_secret_condogest_key';

  jwt.verify(token, secret, (err, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.userId = decoded.id;
    req.condominiosIds = decoded.condominiosIds || [];
    req.userRole = decoded.role;
    return next();
  });
}
