import { pgTable, text, boolean, timestamp, uuid, integer, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { forms } from "./forms";
import { fieldResponses } from "./field_responses";

export const FIELD_TYPES = [
  "short_text",
  "long_text",
  "email",
  "phone",
  "number",
  "date",
  "time",
  "datetime",
  "dropdown",
  "radio",
  "checkbox",
  "rating",
  "yes_no",
  "file_upload",
  "section_header",
  "divider",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export const formFields = pgTable("form_fields", {
  id: uuid("id").defaultRandom().primaryKey(),
  formId: uuid("form_id").notNull().references(() => forms.id, { onDelete: "cascade" }),
  type: text("type").notNull().$type<FieldType>(),
  label: text("label").notNull(),
  placeholder: text("placeholder"),
  helpText: text("help_text"),
  isRequired: boolean("is_required").default(false).notNull(),
  order: integer("order").notNull(),
  options: jsonb("options"),
  // For dropdown/radio/checkbox: { choices: string[] }
  // For rating: { min: 1, max: 5 }
  // For file_upload: { maxSizeMb: 5, allowedTypes: string[] }
  // For number: { min?: number, max?: number, step?: number }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const formFieldsRelations = relations(formFields, ({ one, many }) => ({
  form: one(forms, { fields: [formFields.formId], references: [forms.id] }),
  responses: many(fieldResponses),
}));

export type FormField = typeof formFields.$inferSelect;
export type NewFormField = typeof formFields.$inferInsert;
