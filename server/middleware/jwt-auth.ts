import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { storage } from "../storage";

const JWT_SECRET = process.env.SESSION_SECRET || "dev-secret-change-in-production";
const JWT_EXPIRES_IN = "7d";

export interface JWTPayload {
  id: string;
  username: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function login(username: string, password: string): Promise<{ token: string; user: JWTPayload } | null> {
  const admin = await storage.getAdminByUsername(username);
  if (!admin) {
    return null;
  }

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) {
    return null;
  }

  const user: JWTPayload = {
    id: admin.id,
    username: admin.username,
  };

  const token = generateToken(user);
  return { token, user };
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Check for token in cookie or Authorization header
  const token = req.cookies?.auth_token || req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }

  // Attach user to request
  (req as any).user = payload;
  next();
}
