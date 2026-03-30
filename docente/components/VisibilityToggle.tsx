"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  courseId: string;
  initialVisible: boolean;
}

export default function VisibilityToggle({ courseId, initialVisible }: Props) {
  const [visible, setVisible] = useState(initialVisible);
  const [loading, setLoading] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      await fetch(`/api/courses/${courseId}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_visible: !visible }),
      });
      setVisible(!visible);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={visible ? "Visible para alumnos (click para ocultar)" : "Oculto para alumnos (click para publicar)"}
      className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors disabled:opacity-50 ${
        visible
          ? "text-[#8fbc8f] hover:bg-[#0d1a0f]"
          : "text-[#9aab8a] hover:bg-[#0d1a0f] hover:text-[#f5f0e8]"
      }`}
    >
      {visible ? <Eye size={12} /> : <EyeOff size={12} />}
      {visible ? "Visible" : "Oculto"}
    </button>
  );
}
