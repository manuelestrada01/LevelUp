"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Talent } from "@/talentos/types";
import { Plus, Minus } from "lucide-react";

interface Props {
  courseId: string;
  studentEmail: string;
  grantedTalentIds: string[];
  allTalents: Talent[];
}

export default function TalentGranter({ courseId, studentEmail, grantedTalentIds, allTalents }: Props) {
  const router = useRouter();
  const [granted, setGranted] = useState(new Set(grantedTalentIds));
  const [loading, setLoading] = useState<string | null>(null);

  async function toggle(talentId: string) {
    setLoading(talentId);
    const isGranted = granted.has(talentId);
    await fetch(`/api/students/${encodeURIComponent(studentEmail)}/talent`, {
      method: isGranted ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_id: courseId, talent_id: talentId }),
    });
    setGranted((prev) => {
      const next = new Set(prev);
      if (isGranted) next.delete(talentId);
      else next.add(talentId);
      return next;
    });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {allTalents.map((talent) => {
        const isGranted = granted.has(talent.id);
        return (
          <button
            key={talent.id}
            onClick={() => toggle(talent.id)}
            disabled={loading === talent.id}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors disabled:opacity-50 ${
              isGranted
                ? "bg-[#c9a227]/15 text-[#c9a227] ring-1 ring-[#c9a227]/40"
                : "bg-[#0d1a0f] text-[#9aab8a] hover:bg-[#1e3320]"
            }`}
          >
            <span>{talent.name}</span>
            {isGranted ? <Minus size={10} /> : <Plus size={10} />}
          </button>
        );
      })}
    </div>
  );
}
