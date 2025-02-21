import { User, InsertUser, Drug, InsertDrug } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { drugs, users } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import postgres from "pg";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Drug operations
  getDrugs(): Promise<Drug[]>;
  getDrug(id: number): Promise<Drug | undefined>;
  createDrug(drug: InsertDrug): Promise<Drug>;
  updateDrug(id: number, drug: Partial<Drug>): Promise<Drug | undefined>;
  deleteDrug(id: number): Promise<boolean>;

  // Session store
  sessionStore: session.Store;

  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  getUsersWithNotifications(): Promise<User[]>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Create a separate connection pool for the session store
    // to avoid conflicts with the schema migrations
    const sessionPool = new postgres.Pool({ connectionString: process.env.DATABASE_URL });

    this.sessionStore = new PostgresSessionStore({
      pool: sessionPool,
      tableName: 'session', // Explicitly name the table
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

  async getDrugs(): Promise<Drug[]> {
    return await db.select().from(drugs);
  }

  async getDrug(id: number): Promise<Drug | undefined> {
    const [drug] = await db.select().from(drugs).where(eq(drugs.id, id));
    return drug;
  }

  async createDrug(insertDrug: InsertDrug): Promise<Drug> {
    const [drug] = await db
      .insert(drugs)
      .values({
        ...insertDrug,
        status: 'active',
        createdAt: new Date(),
      })
      .returning();
    return drug;
  }

  async updateDrug(id: number, updateData: Partial<Drug>): Promise<Drug | undefined> {
    const [drug] = await db
      .update(drugs)
      .set(updateData)
      .where(eq(drugs.id, id))
      .returning();
    return drug;
  }

  async deleteDrug(id: number): Promise<boolean> {
    const [drug] = await db
      .delete(drugs)
      .where(eq(drugs.id, id))
      .returning();
    return !!drug;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getUsersWithNotifications(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.emailNotifications, true));
  }
}

export const storage = new DatabaseStorage();