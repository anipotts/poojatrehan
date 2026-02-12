import type { Express } from "express";
import type { Server } from "http";
import passport from "passport";
import multer from "multer";
import { requireAuth, requireGuest } from "./middleware/auth";
import * as portfolioService from "./services/portfolio";
import * as blobService from "./services/blob";

// Configure multer for file uploads (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

export function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ===================
  // Auth Routes
  // ===================

  app.post("/api/auth/login", requireGuest, (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json({
          message: "Login successful",
          user: {
            id: user.id,
            username: user.username,
          }
        });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", requireAuth, (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated() && req.user) {
      return res.json({
        user: {
          id: req.user.id,
          username: req.user.username,
        }
      });
    }
    res.status(401).json({ message: "Not authenticated" });
  });

  // ===================
  // Portfolio Content Routes
  // ===================

  // Get published portfolio (public)
  app.get("/api/portfolio/published", async (req, res, next) => {
    try {
      const portfolio = await portfolioService.getPublishedPortfolio();
      if (!portfolio) {
        return res.status(404).json({ message: "No published portfolio found" });
      }
      res.json(portfolio);
    } catch (error) {
      next(error);
    }
  });

  // Get draft portfolio (admin only)
  app.get("/api/portfolio/draft", requireAuth, async (req, res, next) => {
    try {
      const portfolio = await portfolioService.getDraftPortfolio();
      if (!portfolio) {
        // If no draft exists, return the published version
        const published = await portfolioService.getPublishedPortfolio();
        return res.json(published);
      }
      res.json(portfolio);
    } catch (error) {
      next(error);
    }
  });

  // Save draft (admin only)
  app.post("/api/portfolio/save-draft", requireAuth, async (req, res, next) => {
    try {
      const draft = await portfolioService.saveDraft(req.body);
      res.json(draft);
    } catch (error) {
      next(error);
    }
  });

  // Publish draft (admin only)
  app.post("/api/portfolio/publish", requireAuth, async (req, res, next) => {
    try {
      const portfolio = await portfolioService.publishDraft();
      res.json(portfolio);
    } catch (error) {
      next(error);
    }
  });

  // ===================
  // Image Upload Route
  // ===================

  app.post("/api/upload/image", requireAuth, upload.single("image"), async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const filename = `portfolio/${Date.now()}-${req.file.originalname}`;
      const url = await blobService.uploadImage(req.file.buffer, filename);

      res.json({ url });
    } catch (error) {
      next(error);
    }
  });

  // ===================
  // Experience Routes
  // ===================

  app.post("/api/experiences", requireAuth, async (req, res, next) => {
    try {
      const { portfolioId, ...data } = req.body;
      const experience = await portfolioService.createExperience(portfolioId, data);
      res.json(experience);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/experiences/:id", requireAuth, async (req, res, next) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const experience = await portfolioService.updateExperience(id, req.body);
      res.json(experience);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/experiences/:id", requireAuth, async (req, res, next) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await portfolioService.deleteExperience(id);
      res.json({ message: "Experience deleted" });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/experiences/reorder", requireAuth, async (req, res, next) => {
    try {
      const { portfolioId, orderedIds } = req.body;
      await portfolioService.reorderExperiences(portfolioId, orderedIds);
      res.json({ message: "Experiences reordered" });
    } catch (error) {
      next(error);
    }
  });

  // ===================
  // Education Routes
  // ===================

  app.post("/api/education", requireAuth, async (req, res, next) => {
    try {
      const { portfolioId, ...data } = req.body;
      const edu = await portfolioService.createEducation(portfolioId, data);
      res.json(edu);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/education/:id", requireAuth, async (req, res, next) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const edu = await portfolioService.updateEducation(id, req.body);
      res.json(edu);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/education/:id", requireAuth, async (req, res, next) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await portfolioService.deleteEducation(id);
      res.json({ message: "Education deleted" });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/education/reorder", requireAuth, async (req, res, next) => {
    try {
      const { portfolioId, orderedIds } = req.body;
      await portfolioService.reorderEducation(portfolioId, orderedIds);
      res.json({ message: "Education reordered" });
    } catch (error) {
      next(error);
    }
  });

  // ===================
  // Skills Routes
  // ===================

  app.post("/api/skills", requireAuth, async (req, res, next) => {
    try {
      const { portfolioId, ...data } = req.body;
      const skill = await portfolioService.createSkill(portfolioId, data);
      res.json(skill);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/skills/:id", requireAuth, async (req, res, next) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const skill = await portfolioService.updateSkill(id, req.body);
      res.json(skill);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/skills/:id", requireAuth, async (req, res, next) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await portfolioService.deleteSkill(id);
      res.json({ message: "Skill deleted" });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/skills/reorder", requireAuth, async (req, res, next) => {
    try {
      const { portfolioId, orderedIds } = req.body;
      await portfolioService.reorderSkills(portfolioId, orderedIds);
      res.json({ message: "Skills reordered" });
    } catch (error) {
      next(error);
    }
  });

  return httpServer;
}
