"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Strike } from "@/lib/supabase/game";
import { Unlock, X } from "lucide-react";

interface Props {
  studentEmail: string;
  courseId: string;
  bimestre: string;
  activeStrikes: Strike[];
  blocked: boolean;
}

export default function StrikeManager({
  studentEmail,
  courseId,
  bimestre,
  activeStrikes,
  blocked,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function annulStrike(strikeId: string) {
    setLoading(true);
    await fetch(`/api/students/${encodeURIComponent(studentEmail)}/strike`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ strike_id: strikeId, course_id: courseId }),
    });
    router.refresh();
    setLoading(false);
  }

  async function forceUnlock() {
    setLoading(true);
    await fetch(`/api/students/${encodeURIComponent(studentEmail)}/unlock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_id: courseId }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-2">
      {activeStrikes.length > 0 && (
        <button
          onClick={() => annulStrike(activeStrikes[0].id)}
          disabled={loading}
          title="Anular último strike"
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-[#9aab8a] hover:bg-[#1e3320] hover:text-[#c9a227] disabled:opacity-50"
        >
          <X size={10} />
          Anular strike
        </button>
      )}
      {blocked && (
        <button
          onClick={forceUnlock}
          disabled={loading}
          title="Desbloquear alumno"
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-[#c0392b] hover:bg-[#c0392b]/10 disabled:opacity-50"
        >
          <Unlock size={10} />
          Desbloquear
        </button>
      )}
    </div>
  );
}
