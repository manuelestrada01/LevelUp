"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Star, BookOpen, Shield } from "lucide-react";

interface Props {
  courseId: string;
  bimestre: string;
  studentEmail: string;
}

export default function StudentActionsPanel({ courseId, bimestre, studentEmail }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [xpAmount, setXpAmount] = useState(50);
  const [eventNotes, setEventNotes] = useState("");
  const [open, setOpen] = useState(false);

  async function post(url: string, body: Record<string, unknown>) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Error");
  }

  async function handleEvent() {
    setLoading("event");
    try {
      await post(`/api/students/${encodeURIComponent(studentEmail)}/event`, {
        courseId,
        bimestre,
        xp: xpAmount,
        notes: eventNotes || undefined,
      });
      router.refresh();
    } finally {
      setLoading(null);
      setOpen(false);
    }
  }

  async function handleQuality() {
    setLoading("quality");
    try {
      await post(`/api/students/${encodeURIComponent(studentEmail)}/quality`, {
        courseId,
        bimestre,
        xp: xpAmount,
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  async function handleEva() {
    setLoading("eva");
    try {
      await post(`/api/students/${encodeURIComponent(studentEmail)}/unlock`, {
        courseId,
        bimestre,
        notes: "EVA extraordinaria habilitada",
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={xpAmount}
          onChange={(e) => setXpAmount(parseInt(e.target.value) || 1)}
          className="w-16 rounded border border-[#1e3320] bg-[#0d1a0f] px-2 py-1 text-xs text-[#f5f0e8] outline-none focus:border-[#c9a227]"
        />
        <span className="text-xs text-[#9aab8a]">XP</span>
      </div>

      <input
        type="text"
        placeholder="Notas (opcional)"
        value={eventNotes}
        onChange={(e) => setEventNotes(e.target.value)}
        className="rounded border border-[#1e3320] bg-[#0d1a0f] px-2 py-1 text-xs text-[#f5f0e8] outline-none focus:border-[#c9a227]"
      />

      <div className="flex flex-wrap gap-1.5 pt-1">
        <button
          onClick={handleEvent}
          disabled={loading === "event"}
          title="Habilitar Evento"
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-[#9aab8a] hover:bg-[#1a2e1c] hover:text-[#c9a227] disabled:opacity-50"
        >
          <Zap size={12} /> Evento
        </button>
        <button
          onClick={handleQuality}
          disabled={loading === "quality"}
          title="Calidad Técnica Destacada"
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-[#9aab8a] hover:bg-[#1a2e1c] hover:text-[#c9a227] disabled:opacity-50"
        >
          <Star size={12} /> Calidad
        </button>
        <button
          onClick={handleEva}
          disabled={loading === "eva"}
          title="Habilitar EVA Extraordinaria"
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-[#9aab8a] hover:bg-[#1a2e1c] hover:text-[#c9a227] disabled:opacity-50"
        >
          <BookOpen size={12} /> EVA
        </button>
      </div>
    </div>
  );
}
