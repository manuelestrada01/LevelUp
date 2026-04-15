"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Check, X } from "lucide-react";
import type { TeacherException } from "@/lib/supabase/teacher";

const EXCEPTION_LABELS: Record<string, string> = {
  force_unlock: "Desbloqueo forzado",
  annul_strike: "Anulación de strike",
  force_strike: "Strike forzado",
  enable_recovery: "Evaluación extraordinaria",
  manual_xp: "XP manual",
  force_talent: "Talento forzado",
  annul_talent: "Talento anulado",
};

interface Props {
  studentEmail: string;
  exceptions: TeacherException[];
}

function ExceptionRow({ exception, studentEmail }: { exception: TeacherException; studentEmail: string }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState(exception.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSaveNotes() {
    setSaving(true);
    await fetch(
      `/api/students/${encodeURIComponent(studentEmail)}/exception/${exception.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      }
    );
    setSaving(false);
    setEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("¿Revertir esta excepción? Si es XP manual, el XP será descontado.")) return;
    setDeleting(true);
    await fetch(
      `/api/students/${encodeURIComponent(studentEmail)}/exception/${exception.id}`,
      { method: "DELETE" }
    );
    setDeleting(false);
    router.refresh();
  }

  return (
    <div className="flex items-start justify-between gap-2 rounded-lg bg-[#0d1a0f] px-3 py-2 text-xs">
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span className="text-[#c9a227]">
          {EXCEPTION_LABELS[exception.type] ?? exception.type.replace(/_/g, " ")}
          {exception.value != null && exception.value !== 0 && (
            <span className="ml-1 text-[#8fbc8f]">+{exception.value} XP</span>
          )}
        </span>
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              autoFocus
              className="flex-1 rounded border border-[#1e3320] bg-[#1a2e1c] px-2 py-0.5 text-xs text-[#f5f0e8] outline-none focus:border-[#c9a227]"
            />
            <button
              onClick={handleSaveNotes}
              disabled={saving}
              className="text-[#8fbc8f] hover:text-[#f5f0e8] disabled:opacity-50"
            >
              <Check size={12} />
            </button>
            <button
              onClick={() => { setEditing(false); setNotes(exception.notes ?? ""); }}
              className="text-[#9aab8a] hover:text-[#f5f0e8]"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          exception.notes && <span className="text-[#f5f0e8]">{exception.notes}</span>
        )}
        <span className="text-[#9aab8a]">
          {new Date(exception.created_at).toLocaleDateString("es-AR")}
        </span>
      </div>

      {!editing && (
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setEditing(true)}
            className="rounded p-1 text-[#9aab8a] hover:bg-[#1e3320] hover:text-[#c9a227] transition-colors"
            title="Editar nota"
          >
            <Pencil size={11} />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded p-1 text-[#9aab8a] hover:bg-[#c0392b]/10 hover:text-[#c0392b] transition-colors disabled:opacity-50"
            title="Revertir excepción"
          >
            <Trash2 size={11} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function DestacadosGremioEditor({ studentEmail, exceptions }: Props) {
  if (exceptions.length === 0) return null;

  return (
    <div className="chronicle-stone relative p-4">
      <h2 className="mb-3 font-serif text-base text-[#f5f0e8]">Destacados del Gremio</h2>
      <div className="space-y-1">
        {exceptions.map((ex) => (
          <ExceptionRow key={ex.id} exception={ex} studentEmail={studentEmail} />
        ))}
      </div>
    </div>
  );
}
