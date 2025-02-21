import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  emailNotifications: boolean("email_notifications").notNull().default(true),
});

export const drugs = pgTable("drugs", {
  id: serial("id").primaryKey(),
  genericName: text("generic_name").notNull(),
  brandName: text("brand_name").notNull(),
  manufacturer: text("manufacturer").notNull(),
  batchNumber: text("batch_number").notNull(),
  expirationDate: date("expiration_date").notNull(),
  dosageForm: text("dosage_form").notNull(),
  strength: text("strength").notNull(),
  quantity: integer("quantity").notNull(),
  storageConditions: text("storage_conditions").notNull(),
  packaging: text("packaging").notNull(),
  composition: text("composition").notNull(),
  indication: text("indication").notNull(),
  contraindications: text("contraindications").notNull(),
  sideEffects: text("side_effects").notNull(),
  status: text("status").notNull().default('active'),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users, {
  role: z.enum(['admin', 'pharmacist', 'manufacturer']).describe('User role'),
  email: z.string().email('Invalid email format'),
}).omit({ id: true, isActive: true, emailNotifications: true });

export const insertDrugSchema = createInsertSchema(drugs).omit({ 
  id: true, 
  createdAt: true, 
  status: true 
}).extend({
  expirationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be in YYYY-MM-DD format')
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDrug = z.infer<typeof insertDrugSchema>;
export type Drug = typeof drugs.$inferSelect;