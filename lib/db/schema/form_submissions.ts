import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { forms } from "./forms";
import { fieldResponses } from "./field_responses";

export const formSubmissions = pgTable("form_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  formId: uuid("form_id").notNull().references(() => forms.id, { onDelete: "cascade" }),
  respondentId: text("respondent_id"), // Clerk ID if auth required
  respondentEmail: text("respondent_email"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const formSubmissionsRelations = relations(formSubmissions, ({ one, many }) => ({
  form: one(forms, { fields: [formSubmissions.formId], references: [forms.id] }),
  fieldResponses: many(fieldResponses),
}));

export type FormSubmission = typeof formSubmissions.$inferSelect;
export type NewFormSubmission = typeof formSubmissions.$inferInsert;
