"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface Props {
  strikeId: string;
  courseId: string;
  studentEmail: string;
}

export default function AnnulStrikeButton({ strikeId, courseId, studentEmail }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function annul() {
    setLoading(true);
    await fetch(`/api/students/${encodeURIComponent(studentEmail)}/strike`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ strike_id: strikeId, course_id: courseId }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={annul}
      disabled={loading}
      title="Anular strike"
      className="flex items-center gap-1 rounded px-2 py-0.5 text-xs text-[#9aab8a] transition-colors hover:bg-[#c0392b]/10 hover:text-[#c0392b] disabled:opacity-50"
    >
      <X size={10} />
      Anular
    </button>
  );
}
