// Serverless entry point for Vercel - JWT-based auth
import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

// Body parsing
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: false }));

// Cookie parsing for JWT tokens
app.use(cookieParser());

// Register routes
registerRoutes(httpServer, app);

// Error handler
app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error("Internal Server Error:", err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(status).json({ message });
});

// Export the Express app directly
export default app;
