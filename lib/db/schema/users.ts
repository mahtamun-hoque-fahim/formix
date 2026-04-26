import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { forms } from "./forms";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: text("email").notNull().unique(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  role: text("role").default("user").notNull(), // 'user' | 'admin'
  plan: text("plan").default("free").notNull(), // 'free' | 'pro'
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  forms: many(forms),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
