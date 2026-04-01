"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface XpCardProps {
  xp: number;
  xpCurrentLevel: number;
  xpNextLevel: number;
  level: number;
  levelName: string;
  nextLevelName: string;
  studentName: string;
  blocked?: boolean;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number, duration = 1300) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(easeOutCubic(progress) * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return count;
}

function formatXp(value: number): string {
  return value.toLocaleString("es-AR");
}

export default function XpCard({
  xp,
  xpCurrentLevel,
  xpNextLevel,
  level,
  levelName,
  nextLevelName,
  studentName,
  blocked = false,
}: XpCardProps) {
  const progress = Math.min(
    ((xp - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100,
    100
  );

  const animatedXp = useCountUp(xp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-xl bg-[#0F2411] p-5 border border-[#1e3320]"
    >
      {/* Header: label + XP value */}
      <div className="flex items-start justify-between mb-1">
        <p className="text-xs font-medium uppercase tracking-widest text-[#9aab8a]">
          Resonancia de Experiencia
        </p>
        <div className="text-right">
          <span className="font-serif text-2xl font-bold text-[#c9a227] tabular-nums">
            {formatXp(animatedXp)}
          </span>
          <span className="ml-1.5 text-xs font-semibold uppercase tracking-wider text-[#9aab8a]">
            XP
          </span>
        </div>
      </div>

      {/* Subtitle */}
      <p className="mb-3 text-[10px] uppercase tracking-wider text-[#9aab8a]/70">
        Nivel {level} · {studentName}
        {blocked && (
          <span className="ml-2 text-[#c0392b]">· Bimestre bloqueado</span>
        )}
      </p>

      {/* Progress bar */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-[#0d1a0f]">
        <motion.div
          className={`h-full rounded-full ${
            blocked
              ? "bg-[#c0392b]/60"
              : "bg-gradient-to-r from-[#4a8f5a] via-[#8fbc8f] to-[#c9a227]"
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.3, delay: 0.25, ease: "easeOut" }}
        />
      </div>

      {/* Bottom stats */}
      <div className="mt-3 flex justify-between">
        <p className="text-[10px] uppercase tracking-wider text-[#9aab8a]/70">
          Siguiente hito: {formatXp(xpNextLevel)} XP
        </p>
        <p className="text-[10px] uppercase tracking-wider text-[#9aab8a]">
          {Math.round(progress)}% Completado
        </p>
      </div>
    </motion.div>
  );
}
