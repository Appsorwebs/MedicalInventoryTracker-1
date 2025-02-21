import { User, InsertUser, Drug, InsertDrug } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private drugs: Map<number, Drug>;
  private userId: number;
  private drugId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.drugs = new Map();
    this.userId = 1;
    this.drugId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { id, isActive: true, ...insertUser };
    this.users.set(id, user);
    return user;
  }

  async getDrugs(): Promise<Drug[]> {
    return Array.from(this.drugs.values());
  }

  async getDrug(id: number): Promise<Drug | undefined> {
    return this.drugs.get(id);
  }

  async createDrug(insertDrug: InsertDrug): Promise<Drug> {
    const id = this.drugId++;
    const drug: Drug = {
      id,
      ...insertDrug,
      status: 'active',
      createdAt: new Date(),
    };
    this.drugs.set(id, drug);
    return drug;
  }

  async updateDrug(id: number, updateData: Partial<Drug>): Promise<Drug | undefined> {
    const existingDrug = this.drugs.get(id);
    if (!existingDrug) return undefined;

    const updatedDrug = { ...existingDrug, ...updateData };
    this.drugs.set(id, updatedDrug);
    return updatedDrug;
  }

  async deleteDrug(id: number): Promise<boolean> {
    return this.drugs.delete(id);
  }
}

export const storage = new MemStorage();
