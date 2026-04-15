"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedStatCardProps {
  label: string;
  value: number;
  danger?: boolean;
  index?: number;
  suffix?: string;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number, duration = 1000) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(easeOutCubic(progress) * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return count;
}

export default function AnimatedStatCard({
  label,
  value,
  danger,
  index = 0,
  suffix,
}: AnimatedStatCardProps) {
  const animatedValue = useCountUp(value, 900);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: "easeOut" }}
      className="chronicle-stone relative p-4"
    >
      {/* Corner ◆ marks */}
      <span className="pointer-events-none absolute top-[3px] left-[3px] text-[5px] text-[rgba(160,125,55,0.35)] leading-none select-none z-10">◆</span>
      <span className="pointer-events-none absolute top-[3px] right-[3px] text-[5px] text-[rgba(160,125,55,0.35)] leading-none select-none z-10">◆</span>
      <span className="pointer-events-none absolute bottom-[3px] left-[3px] text-[5px] text-[rgba(160,125,55,0.35)] leading-none select-none z-10">◆</span>
      <span className="pointer-events-none absolute bottom-[3px] right-[3px] text-[5px] text-[rgba(160,125,55,0.35)] leading-none select-none z-10">◆</span>
      {/* Candlelight glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.04)_0%,transparent_60%)]" />
      <p className="relative z-10 text-[11px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.6)]">{label}</p>
      <p
        className={`relative z-10 mt-1 font-serif text-2xl font-bold tabular-nums ${
          danger && value > 0 ? "text-[#c0392b]" : "text-[#c9a227]"
        }`}
      >
        {animatedValue}
        {suffix && <span className="ml-1 text-base font-normal">{suffix}</span>}
      </p>
    </motion.div>
  );
}
