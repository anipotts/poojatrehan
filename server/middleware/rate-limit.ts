import type { Request, Response, NextFunction } from "express";

interface RateLimitEntry {
  count: number;
  resetAt: Date;
}

// In-memory rate limiter: max 5 attempts per 15 minutes per IP
const rateLimit = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Cleanup old entries every 30 minutes
setInterval(() => {
  const now = new Date();
  for (const [ip, entry] of rateLimit.entries()) {
    if (entry.resetAt < now) {
      rateLimit.delete(ip);
    }
  }
}, 30 * 60 * 1000);

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = new Date();

  let entry = rateLimit.get(ip);

  // Reset if window has expired
  if (entry && entry.resetAt < now) {
    entry = undefined;
    rateLimit.delete(ip);
  }

  // Create new entry if doesn't exist
  if (!entry) {
    entry = {
      count: 1,
      resetAt: new Date(now.getTime() + WINDOW_MS),
    };
    rateLimit.set(ip, entry);
    return next();
  }

  // Check if limit exceeded
  if (entry.count >= MAX_ATTEMPTS) {
    const remainingMs = entry.resetAt.getTime() - now.getTime();
    const remainingMin = Math.ceil(remainingMs / 60000);

    return res.status(429).json({
      message: `Too many login attempts. Please try again in ${remainingMin} minute${remainingMin !== 1 ? 's' : ''}.`,
    });
  }

  // Increment counter
  entry.count++;
  rateLimit.set(ip, entry);

  next();
}
