import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { formSubmissions } from "./form_submissions";
import { formFields } from "./form_fields";

export const fieldResponses = pgTable("field_responses", {
  id: uuid("id").defaultRandom().primaryKey(),
  submissionId: uuid("submission_id").notNull().references(() => formSubmissions.id, { onDelete: "cascade" }),
  fieldId: uuid("field_id").notNull().references(() => formFields.id, { onDelete: "cascade" }),
  value: text("value"),
  // For text/email/phone/date/time: raw string
  // For number/rating: stringified number
  // For dropdown/radio: selected option label
  // For checkbox: JSON.stringify(string[])
  // For yes_no: 'yes' | 'no'
  // For file_upload: Cloudinary URL
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fieldResponsesRelations = relations(fieldResponses, ({ one }) => ({
  submission: one(formSubmissions, { fields: [fieldResponses.submissionId], references: [formSubmissions.id] }),
  field: one(formFields, { fields: [fieldResponses.fieldId], references: [formFields.id] }),
}));

export type FieldResponse = typeof fieldResponses.$inferSelect;
export type NewFieldResponse = typeof fieldResponses.$inferInsert;
