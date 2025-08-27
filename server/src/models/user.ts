
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  // password: text("password").notNull(),
  auth0_id: text("auth0_id").notNull().unique(),
  email: text("email").notNull().unique(),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  // password: true,
  email: true,
  auth0_id: true,
});

export type User = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;
