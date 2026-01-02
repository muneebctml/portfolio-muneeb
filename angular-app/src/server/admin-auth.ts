import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

type AdminTokenPayload = { sub: string };

function getEnv(name: string): string | null {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : null;
}

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, 'utf8');
  const bBuf = Buffer.from(b, 'utf8');
  const len = Math.max(aBuf.length, bBuf.length);
  const aPadded = Buffer.concat([aBuf, Buffer.alloc(len - aBuf.length)]);
  const bPadded = Buffer.concat([bBuf, Buffer.alloc(len - bBuf.length)]);
  const equal = crypto.timingSafeEqual(aPadded, bPadded);
  return equal && aBuf.length === bBuf.length;
}

export function validateAdminCredentials(username: string, password: string): boolean {
  const expectedUser = getEnv('ADMIN_USERNAME');
  const expectedPass = getEnv('ADMIN_PASSWORD');
  if (!expectedUser || !expectedPass) return false;
  return safeEqual(username, expectedUser) && safeEqual(password, expectedPass);
}

export function issueAdminToken(username: string): string {
  const secret = getEnv('JWT_SECRET');
  if (!secret) throw new Error('JWT_SECRET not set');
  return jwt.sign({ sub: username } satisfies AdminTokenPayload, secret, { expiresIn: '7d' });
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const token = header.slice('Bearer '.length).trim();
  const secret = getEnv('JWT_SECRET');
  if (!secret) {
    res.status(500).json({ error: 'Server misconfigured: JWT_SECRET not set' });
    return;
  }

  try {
    jwt.verify(token, secret);
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
