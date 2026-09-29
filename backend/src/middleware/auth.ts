import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env["JWT_SECRET"] ?? "") as {
      userId: string;
    };
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
}