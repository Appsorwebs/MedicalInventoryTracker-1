import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertDrugSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Drug routes
  app.get("/api/drugs", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const drugs = await storage.getDrugs();
    res.json(drugs);
  });

  app.get("/api/drugs/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const drug = await storage.getDrug(parseInt(req.params.id));
    if (!drug) return res.sendStatus(404);
    res.json(drug);
  });

  app.post("/api/drugs", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (!["admin", "pharmacist"].includes(req.user.role)) {
      return res.sendStatus(403);
    }

    const result = insertDrugSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error);
    }

    const drug = await storage.createDrug(result.data);
    res.status(201).json(drug);
  });

  app.patch("/api/drugs/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (!["admin", "pharmacist"].includes(req.user.role)) {
      return res.sendStatus(403);
    }

    const drug = await storage.updateDrug(parseInt(req.params.id), req.body);
    if (!drug) return res.sendStatus(404);
    res.json(drug);
  });

  app.delete("/api/drugs/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role !== "admin") return res.sendStatus(403);

    const success = await storage.deleteDrug(parseInt(req.params.id));
    if (!success) return res.sendStatus(404);
    res.sendStatus(204);
  });

  const httpServer = createServer(app);
  return httpServer;
}
