"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Trash2, Plus, Eye, EyeOff, X } from "lucide-react";
import type { FormativeClassEntry } from "@/lib/supabase/classes";

interface Props {
  initialClasses: FormativeClassEntry[];
}

function emptyClass(): FormativeClassEntry {
  return {
    slug: "",
    title: "",
    inspiration: "",
    attributes: ["", ""],
    description: "",
    published: false,
    sort_order: 99,
    verse_text: "",
    verse_reference: "",
  };
}

export default function FormativeClassEditor({ initialClasses }: Props) {
  const [classes, setClasses] = useState<FormativeClassEntry[]>(initialClasses);
  const [editing, setEditing] = useState<FormativeClassEntry | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  function startEdit(cls: FormativeClassEntry) {
    setEditing({ ...cls });
    setIsNew(false);
  }

  function startNew() {
    setEditing(emptyClass());
    setIsNew(true);
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      const url = isNew
        ? `/api/config/macro/classes`
        : `/api/config/macro/classes/${editing.slug}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (res.ok) {
        if (isNew) {
          setClasses((prev) => [...prev, editing]);
        } else {
          setClasses((prev) => prev.map((c) => (c.slug === editing.slug ? editing : c)));
        }
        setEditing(null);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublish(cls: FormativeClassEntry) {
    const updated = { ...cls, published: !cls.published };
    await fetch(`/api/config/macro/classes/${cls.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setClasses((prev) => prev.map((c) => (c.slug === cls.slug ? updated : c)));
  }

  async function handleDelete(slug: string) {
    await fetch(`/api/config/macro/classes/${slug}`, { method: "DELETE" });
    setClasses((prev) => prev.filter((c) => c.slug !== slug));
    if (editing?.slug === slug) setEditing(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <div
            key={cls.slug}
            className="chronicle-stone relative flex flex-col gap-3 p-4"
          >
            {/* Corner ◆ marks */}
            <span className="pointer-events-none absolute top-[3px] left-[3px] text-[5px] text-[rgba(160,125,55,0.3)] leading-none select-none z-10">◆</span>
            <span className="pointer-events-none absolute top-[3px] right-[3px] text-[5px] text-[rgba(160,125,55,0.3)] leading-none select-none z-10">◆</span>
            <span className="pointer-events-none absolute bottom-[3px] left-[3px] text-[5px] text-[rgba(160,125,55,0.3)] leading-none select-none z-10">◆</span>
            <span className="pointer-events-none absolute bottom-[3px] right-[3px] text-[5px] text-[rgba(160,125,55,0.3)] leading-none select-none z-10">◆</span>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.04)_0%,transparent_60%)]" />
            <div className="relative z-10 flex items-start justify-between gap-2">
              <div>
                <h4 className="font-serif text-base text-[rgba(232,224,208,0.92)]">{cls.title}</h4>
                <p className="text-xs font-serif text-[rgba(160,125,55,0.55)]">{cls.inspiration}</p>
              </div>
              <span
                className={`border px-2 py-0.5 text-[10px] font-serif uppercase tracking-widest ${
                  cls.published
                    ? "border-[rgba(143,188,143,0.35)] bg-[rgba(143,188,143,0.08)] text-[#8fbc8f]"
                    : "border-[rgba(160,125,55,0.2)] bg-[rgba(160,125,55,0.05)] text-[rgba(160,125,55,0.45)]"
                }`}
              >
                {cls.published ? "Publicada" : "Borrador"}
              </span>
            </div>
            <p className="relative z-10 text-xs font-serif text-[rgba(160,125,55,0.55)] line-clamp-2">{cls.description}</p>
            <div className="relative z-10 flex flex-wrap gap-1">
              {cls.attributes.filter(Boolean).map((a) => (
                <span key={a} className="border border-[rgba(160,125,55,0.3)] bg-[rgba(160,125,55,0.06)] px-1.5 py-0.5 text-[10px] font-serif uppercase tracking-widest text-[rgba(200,168,75,0.7)]">
                  {a}
                </span>
              ))}
            </div>
            <div className="relative z-10 flex gap-1 pt-1 border-t border-[rgba(160,125,55,0.1)] mt-1">
              <button
                onClick={() => startEdit(cls)}
                className="flex-1 px-2 py-1 text-[11px] font-serif uppercase tracking-[0.12em] text-[rgba(160,125,55,0.55)] hover:text-[rgba(200,168,75,0.85)] transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => handleTogglePublish(cls)}
                title={cls.published ? "Despublicar" : "Publicar"}
                className="p-1 text-[rgba(160,125,55,0.45)] hover:text-[rgba(200,168,75,0.85)] transition-colors"
              >
                {cls.published ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                onClick={() => handleDelete(cls.slug)}
                title="Eliminar"
                className="p-1 text-[rgba(160,125,55,0.35)] hover:text-[#c0392b] transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={startNew}
          className="flex min-h-[140px] items-center justify-center gap-2 border border-dashed border-[rgba(160,125,55,0.2)] text-[rgba(160,125,55,0.4)] hover:border-[rgba(200,168,75,0.45)] hover:text-[rgba(200,168,75,0.75)] transition-colors"
        >
          <Plus size={16} />
          <span className="text-sm">Nueva clase</span>
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
              className="chronicle-stone relative w-full max-w-lg p-6 shadow-2xl"
            >
              {/* Corner bracket ornaments */}
              <div className="pointer-events-none absolute top-0 left-0 h-8 w-8 border-t-2 border-l-2 border-[rgba(200,168,75,0.4)]" />
              <div className="pointer-events-none absolute top-0 right-0 h-8 w-8 border-t-2 border-r-2 border-[rgba(200,168,75,0.4)]" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-[rgba(200,168,75,0.4)]" />
              <div className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-[rgba(200,168,75,0.4)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.04)_0%,transparent_60%)]" />
              <div className="relative z-10 flex items-center justify-between mb-5">
                <h4 className="font-serif text-base font-semibold text-[rgba(232,224,208,0.92)]">
                  {isNew ? "Nueva Clase Formativa" : `Editar: ${editing.title}`}
                </h4>
                <button
                  onClick={() => setEditing(null)}
                  className="text-[rgba(160,125,55,0.5)] hover:text-[rgba(200,168,75,0.85)] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="relative z-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.55)]">Slug (identificador)</span>
                  <input
                    value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    disabled={!isNew}
                    className="border border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.04)] px-3 py-2 text-sm font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.55)] disabled:opacity-40"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.55)]">Título</span>
                  <input
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    className="border border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.04)] px-3 py-2 text-sm font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.55)]"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.55)]">Inspiración bíblica</span>
                  <input
                    value={editing.inspiration}
                    onChange={(e) => setEditing({ ...editing, inspiration: e.target.value })}
                    className="border border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.04)] px-3 py-2 text-sm font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.55)]"
                  />
                </label>
                <label className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-[10px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.55)]">Atributos (máx. 2)</span>
                  <div className="flex gap-2">
                    <input
                      value={editing.attributes[0] ?? ""}
                      onChange={(e) =>
                        setEditing({ ...editing, attributes: [e.target.value, editing.attributes[1] ?? ""] })
                      }
                      placeholder="Atributo 1"
                      className="flex-1 border border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.04)] px-3 py-2 text-sm font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.55)] placeholder:text-[rgba(160,125,55,0.3)]"
                    />
                    <input
                      value={editing.attributes[1] ?? ""}
                      onChange={(e) =>
                        setEditing({ ...editing, attributes: [editing.attributes[0] ?? "", e.target.value] })
                      }
                      placeholder="Atributo 2"
                      className="flex-1 border border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.04)] px-3 py-2 text-sm font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.55)] placeholder:text-[rgba(160,125,55,0.3)]"
                    />
                  </div>
                </label>
                <label className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-[10px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.55)]">Descripción</span>
                  <textarea
                    value={editing.description}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    rows={3}
                    className="border border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.04)] px-3 py-2 text-sm font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.55)] resize-none"
                  />
                </label>
                <label className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-[10px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.55)]">Versículo bíblico (texto)</span>
                  <textarea
                    value={editing.verse_text ?? ""}
                    onChange={(e) => setEditing({ ...editing, verse_text: e.target.value })}
                    rows={2}
                    placeholder="Ej: Jehová es mi pastor; nada me faltará."
                    className="border border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.04)] px-3 py-2 text-sm font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.55)] resize-none placeholder:text-[rgba(160,125,55,0.3)]"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.55)]">Referencia bíblica</span>
                  <input
                    value={editing.verse_reference ?? ""}
                    onChange={(e) => setEditing({ ...editing, verse_reference: e.target.value })}
                    placeholder="Ej: Salmos 23:1"
                    className="border border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.04)] px-3 py-2 text-sm font-serif text-[rgba(232,224,208,0.85)] outline-none focus:border-[rgba(200,168,75,0.55)] placeholder:text-[rgba(160,125,55,0.3)]"
                  />
                </label>
              </div>
              <div className="relative z-10 mt-5 flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 border border-[rgba(200,168,75,0.5)] bg-[rgba(200,168,75,0.12)] px-4 py-2 text-sm font-serif uppercase tracking-[0.12em] text-[rgba(200,168,75,0.9)] disabled:opacity-40 hover:bg-[rgba(200,168,75,0.2)] transition-colors"
                >
                  <Save size={14} />
                  {saving ? "Guardando..." : "Guardar"}
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 text-sm font-serif text-[rgba(160,125,55,0.5)] hover:text-[rgba(200,168,75,0.85)] transition-colors"
                >
                  Cancelar
                </button>
                <label className="ml-auto flex items-center gap-2 text-sm font-serif text-[rgba(160,125,55,0.6)]">
                  <input
                    type="checkbox"
                    checked={editing.published}
                    onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                    className="accent-[#c9a227]"
                  />
                  Publicada
                </label>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
