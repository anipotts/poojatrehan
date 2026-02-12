import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { storage } from "../storage";
import type { Admin } from "@shared/schema";

// Extend Express session to include user
declare global {
  namespace Express {
    interface User extends Admin {}
  }
}

// Configure Passport Local Strategy
export function setupPassport() {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const admin = await storage.getAdminByUsername(username);

        if (!admin) {
          return done(null, false, { message: "Incorrect username or password." });
        }

        const isValid = await bcrypt.compare(password, admin.password);

        if (!isValid) {
          return done(null, false, { message: "Incorrect username or password." });
        }

        return done(null, admin);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize user to session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const admin = await storage.getAdminById(id);
      done(null, admin);
    } catch (error) {
      done(error);
    }
  });
}

// Middleware to check if user is authenticated
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// Middleware to check if user is already authenticated
export function requireGuest(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.status(400).json({ message: "Already authenticated" });
}
