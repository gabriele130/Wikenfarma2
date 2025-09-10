import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Trust proxy - importante dietro Nginx
app.set("trust proxy", 1);

// CORS configuration per wikenship.it
app.use(cors({ 
  origin: "https://wikenship.it", 
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // In production, serve static files from dist/public
    app.use(express.static('dist/public'));
    
    // Serve React app for all non-API routes
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/public/index.html'));
    });
  }

  // Server configuration for wikenship.it domain
  const port = parseInt(process.env.PORT || '3100', 10);
  const additionalPort = parseInt(process.env.ADDITIONAL_PORT || '8080', 10);
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
  
  // Start primary server on main port (3100)
  server.listen(port, host, () => {
    if (process.env.NODE_ENV === 'production') {
      log(`🚀 WikenFarma PRIMARY server running on https://wikenship.it (port ${port})`);
      log(`📡 API endpoints available at https://wikenship.it/api/*`);
    } else {
      log(`🔧 Development PRIMARY server running on http://${host}:${port}`);
      log(`📡 Will be accessible at https://wikenship.it in production`);
    }
  });

  // Start additional server on alternative port (8080) for nginx proxy
  if (process.env.NODE_ENV === 'production') {
    const additionalApp = express();
    
    // Configure additional server with same middleware
    additionalApp.set("trust proxy", 1);
    additionalApp.use(cors({ 
      origin: "https://wikenship.it", 
      credentials: true 
    }));
    additionalApp.use(express.json());
    additionalApp.use(express.urlencoded({ extended: false }));
    
    // Register all the same routes
    const additionalServer = await registerRoutes(additionalApp);
    
    // Copy error handler
    additionalApp.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      throw err;
    });
    
    // Serve static files from dist/public
    additionalApp.use(express.static('dist/public'));
    
    // Serve React app for all non-API routes
    additionalApp.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/public/index.html'));
    });
    
    additionalServer.listen(additionalPort, host, () => {
      log(`🔄 WikenFarma ADDITIONAL server running on port ${additionalPort} (for nginx proxy)`);
      log(`🎯 Use this port in nginx: proxy_pass http://localhost:${additionalPort}/api/;`);
    });
  }
})();
