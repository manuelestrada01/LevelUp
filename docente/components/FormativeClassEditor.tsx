"use client";

import { useState } from "react";
import { Save, Trash2, Plus, Eye, EyeOff } from "lucide-react";
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
            className="flex flex-col gap-3 rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-serif text-base text-[#f5f0e8]">{cls.title}</h4>
                <p className="text-xs text-[#9aab8a]">{cls.inspiration}</p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  cls.published ? "bg-[#8fbc8f]/20 text-[#8fbc8f]" : "bg-[#1e3320] text-[#9aab8a]"
                }`}
              >
                {cls.published ? "Publicada" : "Borrador"}
              </span>
            </div>
            <p className="text-xs text-[#9aab8a] line-clamp-2">{cls.description}</p>
            <div className="flex flex-wrap gap-1">
              {cls.attributes.filter(Boolean).map((a) => (
                <span key={a} className="rounded border border-[#c9a227]/30 px-1.5 py-0.5 text-[10px] text-[#c9a227]">
                  {a}
                </span>
              ))}
            </div>
            <div className="flex gap-1 pt-1">
              <button
                onClick={() => startEdit(cls)}
                className="flex-1 rounded px-2 py-1 text-xs text-[#9aab8a] hover:bg-[#0d1a0f] hover:text-[#f5f0e8]"
              >
                Editar
              </button>
              <button
                onClick={() => handleTogglePublish(cls)}
                title={cls.published ? "Despublicar" : "Publicar"}
                className="rounded p-1 text-[#9aab8a] hover:bg-[#0d1a0f] hover:text-[#c9a227]"
              >
                {cls.published ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                onClick={() => handleDelete(cls.slug)}
                title="Eliminar"
                className="rounded p-1 text-[#9aab8a] hover:bg-[#c0392b]/10 hover:text-[#c0392b]"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={startNew}
          className="flex min-h-[140px] items-center justify-center gap-2 rounded-xl border border-dashed border-[#1e3320] text-[#9aab8a] hover:border-[#c9a227]/40 hover:text-[#c9a227]"
        >
          <Plus size={16} />
          <span className="text-sm">Nueva clase</span>
        </button>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="rounded-xl border border-[#c9a227]/30 bg-[#1a2e1c] p-5">
          <h4 className="mb-4 font-serif text-base text-[#f5f0e8]">
            {isNew ? "Nueva Clase Formativa" : `Editar: ${editing.title}`}
          </h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[#9aab8a]">Slug (identificador)</span>
              <input
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                disabled={!isNew}
                className="rounded border border-[#1e3320] bg-[#0d1a0f] px-3 py-2 text-sm text-[#f5f0e8] outline-none focus:border-[#c9a227] disabled:opacity-50"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[#9aab8a]">Título</span>
              <input
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="rounded border border-[#1e3320] bg-[#0d1a0f] px-3 py-2 text-sm text-[#f5f0e8] outline-none focus:border-[#c9a227]"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[#9aab8a]">Inspiración bíblica</span>
              <input
                value={editing.inspiration}
                onChange={(e) => setEditing({ ...editing, inspiration: e.target.value })}
                className="rounded border border-[#1e3320] bg-[#0d1a0f] px-3 py-2 text-sm text-[#f5f0e8] outline-none focus:border-[#c9a227]"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[#9aab8a]">Atributos (máx. 2)</span>
              <div className="flex gap-2">
                <input
                  value={editing.attributes[0] ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, attributes: [e.target.value, editing.attributes[1] ?? ""] })
                  }
                  placeholder="Atributo 1"
                  className="flex-1 rounded border border-[#1e3320] bg-[#0d1a0f] px-3 py-2 text-sm text-[#f5f0e8] outline-none focus:border-[#c9a227]"
                />
                <input
                  value={editing.attributes[1] ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, attributes: [editing.attributes[0] ?? "", e.target.value] })
                  }
                  placeholder="Atributo 2"
                  className="flex-1 rounded border border-[#1e3320] bg-[#0d1a0f] px-3 py-2 text-sm text-[#f5f0e8] outline-none focus:border-[#c9a227]"
                />
              </div>
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs text-[#9aab8a]">Descripción</span>
              <textarea
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                rows={3}
                className="rounded border border-[#1e3320] bg-[#0d1a0f] px-3 py-2 text-sm text-[#f5f0e8] outline-none focus:border-[#c9a227] resize-none"
              />
            </label>
          </div>
          <div className="mt-4 flex items-center gap-3">
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
                checked={editing.published}
                onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                className="accent-[#c9a227]"
              />
              Publicada
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
