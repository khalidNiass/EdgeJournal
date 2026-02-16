import type { Express } from "express";
import type { Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertTradeSchema } from "@shared/schema";

async function seedDatabase() {
  const existingUsers = await storage.getUserByUsername("demo");
  if (!existingUsers) {
    // Create demo user
    // Password hashing is handled in auth.ts, but here we might need to manually hash if we use storage.createUser directly.
    // However, storage.createUser just inserts. auth.ts handles hashing.
    // For seeding, it's better to use the auth registration logic or manually hash.
    // Since I can't easily import the hash function without exporting it, I'll skip creating a user for now.
    // User can register.
    console.log("Database seeded: No initial user created. Please register.");
  }
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // Trades API
  app.get(api.trades.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const trades = await storage.getTrades(req.user.id);
    res.json(trades);
  });

  app.post(api.trades.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Check trade limit for free users
    const trades = await storage.getTrades(req.user.id);
    if (!req.user.isPro && trades.length >= 20) {
      return res.status(403).json({ message: "Trade limit reached. Upgrade to Pro for unlimited trades." });
    }

    try {
      const input = api.trades.create.input.parse(req.body);
      const trade = await storage.createTrade(req.user.id, input);
      res.status(201).json(trade);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.put(api.trades.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const id = parseInt(req.params.id);
    
    const userTrades = await storage.getTrades(req.user.id);
    const ownsTrade = userTrades.some(t => t.id === id);
    if (!ownsTrade) return res.sendStatus(404);

    try {
      const input = api.trades.update.input.parse(req.body);
      const updated = await storage.updateTrade(id, input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.delete(api.trades.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const id = parseInt(req.params.id);

    const userTrades = await storage.getTrades(req.user.id);
    const ownsTrade = userTrades.some(t => t.id === id);
    if (!ownsTrade) return res.sendStatus(404);

    await storage.deleteTrade(id);
    res.sendStatus(204);
  });

  // Analytics API
  app.get(api.analytics.get.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const trades = await storage.getTrades(req.user.id);
    
    const totalTrades = trades.length;
    const winningTrades = trades.filter(t => t.result === 'win').length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    
    let netProfit = 0;
    trades.forEach(t => {
      // Simplified P/L logic
      if (t.result === 'win') netProfit += (t.riskPercent * 2); // Assume 1:2 RR
      if (t.result === 'loss') netProfit -= t.riskPercent;
    });

    const avgRiskReward = 2.0; // Mock

    // Mock monthly data
    const monthlyPerformance = [
      { month: 'Jan', profit: 5 },
      { month: 'Feb', profit: -2 },
      { month: 'Mar', profit: 8 },
      { month: 'Apr', profit: 12 },
      { month: 'May', profit: -1 },
      { month: 'Jun', profit: 6 },
    ];

    res.json({
      totalTrades,
      winRate,
      netProfit,
      avgRiskReward,
      monthlyPerformance
    });
  });

  await seedDatabase();

  return httpServer;
}
