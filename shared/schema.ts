import { pgTable, text, serial, integer, boolean, timestamp, numeric, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isPro: boolean("is_pro").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Foreign key to users.id handled in app logic or strict FK
  pair: text("pair").notNull(), // e.g., EURUSD, BTCUSD
  entryPrice: doublePrecision("entry_price").notNull(),
  stopLoss: doublePrecision("stop_loss").notNull(),
  takeProfit: doublePrecision("take_profit").notNull(),
  riskPercent: doublePrecision("risk_percent").notNull(),
  positionType: text("position_type").notNull(), // 'long' | 'short'
  result: text("result"), // 'win' | 'loss' | 'breakeven' | 'open'
  strategy: text("strategy"),
  notes: text("notes"),
  date: timestamp("date").defaultNow().notNull(),
  exitTime: timestamp("exit_time"),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, isPro: true });
export const insertTradeSchema = createInsertSchema(trades, {
  date: z.preprocess((value) => {
    if (!value) return undefined;
    return value instanceof Date ? value : new Date(String(value));
  }, z.date().optional()),
  exitTime: z.preprocess((value) => {
    if (value === null || value === undefined || value === "") return null;
    return value instanceof Date ? value : new Date(String(value));
  }, z.date().nullable().optional()),
}).omit({ id: true, userId: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Trade = typeof trades.$inferSelect;
export type InsertTrade = z.infer<typeof insertTradeSchema>;
