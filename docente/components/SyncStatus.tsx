"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

interface Props {
  courseId: string;
}

export default function SyncStatus({ courseId }: Props) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSync(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setSyncing(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/courses/${courseId}/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(`Error: ${data.error ?? "desconocido"}`);
        return;
      }
      const parts = [`${data.studentCount} alumnos`];
      if (data.strikesCreated > 0) parts.push(`+${data.strikesCreated} strikes`);
      if (data.strikesSkipped > 0) {
        const firstErr = data.errors?.[0] ?? "";
        parts.push(`${data.strikesSkipped} strikes con error: ${firstErr}`);
      }
      setMessage(data.synced ? parts.join(" · ") : "Sin cambios");
      router.refresh();
    } catch {
      setMessage("Error al sincronizar");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="mt-3 flex items-center justify-between">
      {message && <span className="text-xs text-[#8fbc8f]">{message}</span>}
      {!message && <span />}
      <button
        onClick={handleSync}
        disabled={syncing}
        className="flex items-center gap-1 rounded px-2 py-1 text-xs text-[#9aab8a] transition-colors hover:bg-[#0d1a0f] hover:text-[#c9a227] disabled:opacity-50"
      >
        <RefreshCw size={10} className={syncing ? "animate-spin" : ""} />
        {syncing ? "Sincronizando..." : "Sincronizar"}
      </button>
    </div>
  );
}
