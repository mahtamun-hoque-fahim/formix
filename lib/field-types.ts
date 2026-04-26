import {
  Type, AlignLeft, Mail, Phone, Hash, Calendar, Clock,
  CalendarClock, ChevronDown, CircleDot, CheckSquare,
  Star, ToggleLeft, Upload, Heading, Minus,
} from "lucide-react";
import { FieldType } from "@/lib/db/schema";

export interface FieldDefinition {
  type: FieldType;
  label: string;
  icon: React.ElementType;
  category: "text" | "choice" | "date" | "other";
  defaultLabel: string;
  hasOptions: boolean;
  isDisplay: boolean;
}

export const FIELD_DEFINITIONS: FieldDefinition[] = [
  { type: "short_text", label: "Short Text", icon: Type, category: "text", defaultLabel: "Short Answer", hasOptions: false, isDisplay: false },
  { type: "long_text", label: "Long Text", icon: AlignLeft, category: "text", defaultLabel: "Long Answer", hasOptions: false, isDisplay: false },
  { type: "email", label: "Email", icon: Mail, category: "text", defaultLabel: "Email Address", hasOptions: false, isDisplay: false },
  { type: "phone", label: "Phone", icon: Phone, category: "text", defaultLabel: "Phone Number", hasOptions: false, isDisplay: false },
  { type: "number", label: "Number", icon: Hash, category: "text", defaultLabel: "Number", hasOptions: false, isDisplay: false },
  { type: "date", label: "Date", icon: Calendar, category: "date", defaultLabel: "Date", hasOptions: false, isDisplay: false },
  { type: "time", label: "Time", icon: Clock, category: "date", defaultLabel: "Time", hasOptions: false, isDisplay: false },
  { type: "datetime", label: "Date & Time", icon: CalendarClock, category: "date", defaultLabel: "Date & Time", hasOptions: false, isDisplay: false },
  { type: "dropdown", label: "Dropdown", icon: ChevronDown, category: "choice", defaultLabel: "Select an option", hasOptions: true, isDisplay: false },
  { type: "radio", label: "Radio", icon: CircleDot, category: "choice", defaultLabel: "Choose one", hasOptions: true, isDisplay: false },
  { type: "checkbox", label: "Checkbox", icon: CheckSquare, category: "choice", defaultLabel: "Select all that apply", hasOptions: true, isDisplay: false },
  { type: "rating", label: "Rating", icon: Star, category: "other", defaultLabel: "Rate your experience", hasOptions: false, isDisplay: false },
  { type: "yes_no", label: "Yes / No", icon: ToggleLeft, category: "other", defaultLabel: "Yes or No?", hasOptions: false, isDisplay: false },
  { type: "file_upload", label: "File Upload", icon: Upload, category: "other", defaultLabel: "Upload a file", hasOptions: false, isDisplay: false },
  { type: "section_header", label: "Section Header", icon: Heading, category: "other", defaultLabel: "Section Title", hasOptions: false, isDisplay: true },
  { type: "divider", label: "Divider", icon: Minus, category: "other", defaultLabel: "—", hasOptions: false, isDisplay: true },
];

export const FIELD_CATEGORIES = [
  { id: "text", label: "Text" },
  { id: "choice", label: "Choice" },
  { id: "date", label: "Date & Time" },
  { id: "other", label: "Other" },
] as const;

export function getFieldDef(type: FieldType): FieldDefinition {
  return FIELD_DEFINITIONS.find((d) => d.type === type) ?? FIELD_DEFINITIONS[0];
}
