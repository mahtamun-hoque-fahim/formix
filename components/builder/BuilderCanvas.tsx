"use client";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { FormField } from "@/lib/db/schema";
import { FieldBlock } from "./FieldBlock";
import { MousePointerClick } from "lucide-react";

interface BuilderCanvasProps {
  fields: FormField[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onReorder: (fields: FormField[]) => void;
}

export function BuilderCanvas({ fields, selectedId, onSelect, onDelete, onDuplicate, onReorder }: BuilderCanvasProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      onReorder(arrayMove(fields, oldIndex, newIndex));
    }
  }

  if (fields.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <MousePointerClick size={22} style={{ color: "var(--text-muted)" }} />
          </div>
          <p className="font-medium" style={{ color: "var(--text)" }}>No fields yet</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Click a field type on the left to add it
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-3">
              {fields.map((field) => (
                <FieldBlock
                  key={field.id}
                  field={field}
                  isSelected={selectedId === field.id}
                  onSelect={() => onSelect(field.id)}
                  onDelete={() => onDelete(field.id)}
                  onDuplicate={() => onDuplicate(field.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
