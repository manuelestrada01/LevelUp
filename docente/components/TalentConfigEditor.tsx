"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Trash2, Plus, X } from "lucide-react";
import type { TalentConfigEntry } from "@/lib/supabase/config";

interface Props {
  initialTalents: TalentConfigEntry[];
}

function emptyTalent(): TalentConfigEntry {
  return {
    slug: "",
    name: "",
    attributes: ["", ""],
    description: "",
    conditions: {},
    active: true,
    sort_order: 99,
  };
}

export default function TalentConfigEditor({ initialTalents }: Props) {
  const [talents, setTalents] = useState<TalentConfigEntry[]>(initialTalents);
  const [editing, setEditing] = useState<TalentConfigEntry | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  function startEdit(t: TalentConfigEntry) {
    setEditing({ ...t });
    setIsNew(false);
  }

  function startNew() {
    setEditing(emptyTalent());
    setIsNew(true);
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      const url = isNew
        ? `/api/config/macro/talents`
        : `/api/config/macro/talents/${editing.slug}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (res.ok) {
        if (isNew) {
          setTalents((prev) => [...prev, editing]);
        } else {
          setTalents((prev) => prev.map((t) => (t.slug === editing.slug ? editing : t)));
        }
        setEditing(null);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slug: string) {
    await fetch(`/api/config/macro/talents/${slug}`, { method: "DELETE" });
    setTalents((prev) => prev.filter((t) => t.slug !== slug));
    if (editing?.slug === slug) setEditing(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {talents.map((t) => (
          <div
            key={t.slug}
            className={`flex flex-col gap-2 rounded-xl border p-4 ${
              t.active ? "border-[#1e3320] bg-[#1a2e1c]" : "border-[#1e3320] bg-[#0d1a0f] opacity-60"
            }`}
          >
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-[#f5f0e8]">{t.name}</h4>
              {!t.active && (
                <span className="text-[10px] text-[#9aab8a] rounded border border-[#1e3320] px-1.5 py-0.5">
                  Inactivo
                </span>
              )}
            </div>
            <p className="text-xs text-[#9aab8a] line-clamp-2">{t.description}</p>
            <div className="flex flex-wrap gap-1">
              {t.attributes.filter(Boolean).map((a) => (
                <span key={a} className="rounded border border-[#c9a227]/30 px-1.5 py-0.5 text-[10px] text-[#c9a227]">
                  {a}
                </span>
              ))}
            </div>
            <div className="flex gap-1 pt-1">
              <button
                onClick={() => startEdit(t)}
                className="flex-1 rounded px-2 py-1 text-xs text-[#9aab8a] hover:bg-[#1a2e1c] hover:text-[#f5f0e8]"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(t.slug)}
                className="rounded p-1 text-[#9aab8a] hover:bg-[#c0392b]/10 hover:text-[#c0392b]"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={startNew}
          className="flex min-h-[120px] items-center justify-center gap-2 rounded-xl border border-dashed border-[#1e3320] text-[#9aab8a] hover:border-[#c9a227]/40 hover:text-[#c9a227]"
        >
          <Plus size={16} />
          <span className="text-sm">Nuevo talento</span>
        </button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="relative w-full max-w-lg rounded-xl border border-[#1e3320] bg-[#0d1a0f] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h4 className="font-serif text-base text-[#f5f0e8]">
                  {isNew ? "Nuevo Talento" : `Editar: ${editing.name}`}
                </h4>
                <button
                  onClick={() => setEditing(null)}
                  className="text-[#9aab8a] hover:text-[#f5f0e8]"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-[#9aab8a]">Slug</span>
                  <input
                    value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    disabled={!isNew}
                    className="rounded border border-[#1e3320] bg-[#1a2e1c] px-3 py-2 text-sm text-[#f5f0e8] outline-none focus:border-[#c9a227] disabled:opacity-50"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-[#9aab8a]">Nombre</span>
                  <input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="rounded border border-[#1e3320] bg-[#1a2e1c] px-3 py-2 text-sm text-[#f5f0e8] outline-none focus:border-[#c9a227]"
                  />
                </label>
                <label className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-xs text-[#9aab8a]">Atributos (máx. 2)</span>
                  <div className="flex gap-2">
                    <input
                      value={editing.attributes[0] ?? ""}
                      onChange={(e) =>
                        setEditing({ ...editing, attributes: [e.target.value, editing.attributes[1] ?? ""] })
                      }
                      placeholder="Atributo 1"
                      className="flex-1 rounded border border-[#1e3320] bg-[#1a2e1c] px-2 py-2 text-sm text-[#f5f0e8] outline-none focus:border-[#c9a227]"
                    />
                    <input
                      value={editing.attributes[1] ?? ""}
                      onChange={(e) =>
                        setEditing({ ...editing, attributes: [editing.attributes[0] ?? "", e.target.value] })
                      }
                      placeholder="Atributo 2"
                      className="flex-1 rounded border border-[#1e3320] bg-[#1a2e1c] px-2 py-2 text-sm text-[#f5f0e8] outline-none focus:border-[#c9a227]"
                    />
                  </div>
                </label>
                <label className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-xs text-[#9aab8a]">Descripción</span>
                  <textarea
                    value={editing.description}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    rows={3}
                    className="rounded border border-[#1e3320] bg-[#1a2e1c] px-3 py-2 text-sm text-[#f5f0e8] outline-none focus:border-[#c9a227] resize-none"
                  />
                </label>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-[#c9a227] px-4 py-2 text-sm font-medium text-[#0d1a0f] disabled:opacity-50"
                >
                  <Save size={14} />
                  {saving ? "Guardando..." : "Guardar"}
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="rounded-lg px-4 py-2 text-sm text-[#9aab8a] hover:text-[#f5f0e8]"
                >
                  Cancelar
                </button>
                <label className="ml-auto flex items-center gap-2 text-sm text-[#9aab8a]">
                  <input
                    type="checkbox"
                    checked={editing.active}
                    onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                    className="accent-[#c9a227]"
                  />
                  Activo
                </label>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
