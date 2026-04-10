"use client";

import { useEffect } from "react";

export default function SyncTrigger() {
  useEffect(() => {
    fetch("/api/sync/student", { method: "POST" }).catch(() => {});
  }, []);

  return null;
}
