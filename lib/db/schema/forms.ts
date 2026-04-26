import { pgTable, text, boolean, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { formFields } from "./form_fields";
import { formSubmissions } from "./form_submissions";

export const forms = pgTable("forms", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  status: text("status").default("draft").notNull(), // 'draft' | 'published' | 'closed'
  coverImageUrl: text("cover_image_url"),
  accentColor: text("accent_color").default("#6366f1"),
  allowMultipleSubmissions: boolean("allow_multiple_submissions").default(true).notNull(),
  requireAuth: boolean("require_auth").default(false).notNull(),
  submissionLimit: integer("submission_limit"),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  successMessage: text("success_message").default("Thank you for your response!"),
  redirectUrl: text("redirect_url"),
  notifyOnSubmission: boolean("notify_on_submission").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const formsRelations = relations(forms, ({ one, many }) => ({
  user: one(users, { fields: [forms.userId], references: [users.id] }),
  fields: many(formFields),
  submissions: many(formSubmissions),
}));

export type Form = typeof forms.$inferSelect;
export type NewForm = typeof forms.$inferInsert;
