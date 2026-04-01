"use client";

import { motion } from "framer-motion";
import type { FormativeClassEntry } from "@/lib/supabase/classes";

interface HeroSectionProps {
  studentName: string;
  classEntry: FormativeClassEntry | null;
}

const textContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const textItem = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HeroSection({ studentName, classEntry }: HeroSectionProps) {
  const classLabel = classEntry?.title.toUpperCase() ?? "ESTUDIANTE";
  const heroText =
    classEntry?.description ??
    "Tu recorrido en el nexo técnico continúa. Mantén la resonancia alta para desbloquear nuevos fragmentos de sabiduría.";

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-[#1e3320]"
      style={{ minHeight: "400px" }}
    >
      {/* Background image — zoom-in on mount */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/images/bosque.png')",
          backgroundPosition: "center 65%",
        }}
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.8, ease: "easeOut" }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#031706]/80 via-[#031706]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#031706]/50 via-transparent to-transparent" />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full flex h-full flex-col justify-center px-6 py-10"
        variants={textContainer}
        initial="hidden"
        animate="show"
      >
        <motion.p
          variants={textItem}
          className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#c9a227]/60"
        >
          Bienvenido de vuelta, {classLabel}
        </motion.p>
        <motion.h1
          variants={textItem}
          className="font-serif text-6xl font-normal leading-tight text-[#f5f0e8] max-w-2xl"
        >
          Tu progreso en el nexo
          <br />
          técnico continúa,{" "}
          <em className="text-[#c9a227] not-italic font-normal">{studentName}.</em>
        </motion.h1>
        <motion.p
          variants={textItem}
          className="mt-4 max-w-lg text-base leading-relaxed text-[#9aab8a]"
        >
          {heroText}
        </motion.p>
      </motion.div>
    </div>
  );
}
