import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth.js";
import { storage } from "./storage.js";
import { insertSnippetSchema } from "../shared/schema.js";
import { z } from "zod";

export function registerRoutes(app: Express): Server {
  // Setup authentication routes
  setupAuth(app);

  // Snippet routes
  app.get("/api/snippets", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const snippets = await storage.getSnippets(limit, offset);
      res.json(snippets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch snippets" });
    }
  });

  app.get("/api/snippets/popular", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const snippets = await storage.getPopularSnippets(limit);
      res.json(snippets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular snippets" });
    }
  });

  app.get("/api/snippets/:id", async (req, res) => {
    try {
      const snippet = await storage.getSnippet(req.params.id);
      if (!snippet) {
        return res.status(404).json({ message: "Snippet not found" });
      }
      res.json(snippet);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch snippet" });
    }
  });

  app.post("/api/snippets", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const validatedData = insertSnippetSchema.parse(req.body);
      const snippet = await storage.createSnippet({
        ...validatedData,
        authorId: req.user!.id,
      });
      res.status(201).json(snippet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid snippet data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create snippet" });
    }
  });

  app.put("/api/snippets/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const snippet = await storage.getSnippet(req.params.id);
      if (!snippet) {
        return res.status(404).json({ message: "Snippet not found" });
      }

      if (snippet.authorId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized to edit this snippet" });
      }

      const validatedData = insertSnippetSchema.partial().parse(req.body);
      const updatedSnippet = await storage.updateSnippet(req.params.id, validatedData);
      res.json(updatedSnippet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid snippet data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update snippet" });
    }
  });

  app.delete("/api/snippets/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const snippet = await storage.getSnippet(req.params.id);
      if (!snippet) {
        return res.status(404).json({ message: "Snippet not found" });
      }

      if (snippet.authorId !== req.user!.id) {
        return res.status(403).json({ message: "Not authorized to delete this snippet" });
      }

      const deleted = await storage.deleteSnippet(req.params.id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to delete snippet" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete snippet" });
    }
  });

  app.get("/api/user/snippets", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const snippets = await storage.getSnippetsByUser(req.user!.id);
      res.json(snippets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user snippets" });
    }
  });

  app.post("/api/snippets/:id/like", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const success = await storage.likeSnippet(req.params.id, req.user!.id);
      if (success) {
        res.json({ message: "Snippet liked" });
      } else {
        res.status(400).json({ message: "Already liked or snippet not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to like snippet" });
    }
  });

  app.delete("/api/snippets/:id/like", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const success = await storage.unlikeSnippet(req.params.id, req.user!.id);
      if (success) {
        res.json({ message: "Snippet unliked" });
      } else {
        res.status(400).json({ message: "Not liked or snippet not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to unlike snippet" });
    }
  });

  app.get("/api/snippets/:id/liked", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const liked = await storage.isSnippetLiked(req.params.id, req.user!.id);
      res.json({ liked });
    } catch (error) {
      res.status(500).json({ message: "Failed to check like status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
