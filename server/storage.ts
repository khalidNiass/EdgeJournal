import { users, trades, type User, type InsertUser, type Trade, type InsertTrade } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getTrades(userId: number): Promise<Trade[]>;
  createTrade(userId: number, trade: InsertTrade): Promise<Trade>;
  updateTrade(id: number, trade: Partial<InsertTrade>): Promise<Trade | undefined>;
  deleteTrade(id: number): Promise<void>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getTrades(userId: number): Promise<Trade[]> {
    return await db.select().from(trades).where(eq(trades.userId, userId));
  }

  async createTrade(userId: number, insertTrade: InsertTrade): Promise<Trade> {
    const [trade] = await db.insert(trades).values({ ...insertTrade, userId }).returning();
    return trade;
  }

  async updateTrade(id: number, updates: Partial<InsertTrade>): Promise<Trade | undefined> {
    const [updatedTrade] = await db.update(trades).set(updates).where(eq(trades.id, id)).returning();
    return updatedTrade;
  }

  async deleteTrade(id: number): Promise<void> {
    await db.delete(trades).where(eq(trades.id, id));
  }
}

export const storage = new DatabaseStorage();
