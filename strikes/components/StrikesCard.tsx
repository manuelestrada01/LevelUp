"use client";

import { motion } from "framer-motion";

const MAX_STRIKES = 3;

interface StrikesCardProps {
  strikes: number;
  blocked?: boolean;
}

const STRIKE_MESSAGES: Record<number, string> = {
  0: "Sin incumplimientos activos. El camino está despejado.",
  1: "1/3 Activos. Mantén la rectitud técnica para evitar la purga de privilegios.",
  2: "2/3 Activos. Un incumplimiento más bloqueará el bimestre.",
  3: "3/3 Activos. Bimestre bloqueado. Regulariza tu situación para continuar.",
};

export default function StrikesCard({ strikes, blocked = false }: StrikesCardProps) {
  const clamped = Math.min(strikes, MAX_STRIKES);
  const message = STRIKE_MESSAGES[clamped] ?? STRIKE_MESSAGES[3];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
      className={`rounded-xl p-5 border ${
        blocked
          ? "bg-[#c0392b]/10 border-[#c0392b]/30"
          : "bg-[#0F2411] border-[#1e3320]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium uppercase tracking-widest text-[#9aab8a]">
          Strikes Académicos
        </p>
        {clamped >= 2 && (
          <motion.span
            className="text-[#c9a227] text-sm"
            animate={{ x: [0, -3, 3, -2, 0] }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            ⚠
          </motion.span>
        )}
      </div>

      {/* Strike icons */}
      <div className="flex items-center gap-2 mb-4">
        {Array.from({ length: MAX_STRIKES }).map((_, i) => {
          const isActive = i < clamped;
          return (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isActive && blocked
                  ? { scale: 1, opacity: [1, 0.6, 1] }
                  : { scale: 1, opacity: 1 }
              }
              transition={
                isActive
                  ? {
                      scale: {
                        delay: i * 0.1,
                        type: "spring",
                        stiffness: 380,
                        damping: 14,
                      },
                      opacity: isActive && blocked
                        ? { duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }
                        : { delay: i * 0.1, duration: 0.2 },
                    }
                  : {
                      scale: { delay: i * 0.1, duration: 0.3 },
                      opacity: { delay: i * 0.1, duration: 0.3 },
                    }
              }
              className={`flex h-14 flex-1 items-center justify-center rounded-lg border text-base font-bold ${
                isActive
                  ? "border-[#c0392b] bg-[#c0392b]/20 text-[#c0392b]"
                  : "border-[#1e3320] bg-[#0d1a0f]/60 text-[#1e3320]"
              }`}
            >
              ✕
            </motion.div>
          );
        })}
      </div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-[11px] leading-relaxed text-[#9aab8a]"
      >
        {message}
      </motion.p>
    </motion.div>
  );
}
