"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Axe,
  Music,
  HeartHandshake,
  Shield,
  Leaf,
  BookOpen,
  RotateCcw,
  X,
  type LucideIcon,
} from "lucide-react";
import type { FormativeClassEntry } from "@/lib/supabase/classes";

const ATTRIBUTE_LABELS: Record<string, string> = {
  Fuerza: "FUERZA",
  Constitución: "VIGOR",
  Carisma: "CARISMA",
  Destreza: "ARTE",
  Sabiduría: "SABID.",
  Inteligencia: "INTELIG.",
};

const CLASS_ICONS: Record<string, LucideIcon> = {
  barbaro: Axe,
  bardo: Music,
  clerigo: HeartHandshake,
  paladin: Shield,
  druida: Leaf,
  erudito: BookOpen,
};

interface ClassesSectionProps {
  activeClassSlug: string;
  classes: FormativeClassEntry[];
}

export default function ClassesSection({ activeClassSlug, classes }: ClassesSectionProps) {
  const [openClass, setOpenClass] = useState<FormativeClassEntry | null>(null);
  const [flipped, setFlipped] = useState(false);

  if (classes.length === 0) return null;

  function handleOpen(cls: FormativeClassEntry) {
    setOpenClass(cls);
    setFlipped(false);
  }

  function handleClose() {
    setOpenClass(null);
    setFlipped(false);
  }

  return (
    <>
      <section className="pb-8">
        {/* Section header — centered */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-6 flex flex-col items-center text-center"
        >
          <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#9aab8a]">
            Especialización de Gremio
          </p>
          <h2 className="font-serif text-2xl font-bold text-[#f5f0e8]">
            Clases Formativas
          </h2>
          <p className="mt-2 max-w-[320px] text-[10px] italic leading-relaxed text-[#9aab8a]/70">
            "Porque muchos son llamados, más pocos son los escogidos."
            <br />
            <span className="not-italic">— Arquetipos del Conocimiento</span>
          </p>
        </motion.div>

        {/* Cards — centered wrap */}
        <div className="flex flex-wrap justify-center gap-4">
          {classes.map((cls, index) => {
            const isActive = cls.slug === activeClassSlug;
            const [attr1, attr2] = cls.attributes;
            const ClassIcon = CLASS_ICONS[cls.slug] ?? BookOpen;

            return (
              <motion.div
                key={cls.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.05 + index * 0.07,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOpen(cls)}
                className={`relative flex w-[200px] cursor-pointer flex-col overflow-hidden rounded-xl border p-4 transition-colors ${
                  isActive
                    ? "border-[#c9a227]/60 bg-[#c9a227]/10"
                    : "border-[#1e3320] bg-[#0F2411] hover:border-[#8fbc8f]/30"
                }`}
              >
                {/* Watermark icon */}
                <ClassIcon
                  size={80}
                  strokeWidth={1}
                  className={`absolute -top-3 -right-3 pointer-events-none transition-all duration-500 ${
                    isActive ? "text-[#c9a227]/15 scale-110" : "text-[#9aab8a]/10"
                  }`}
                />

                {/* Active badge */}
                {isActive && (
                  <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-[#c9a227]/20 px-1.5 py-0.5 text-[9px] font-semibold text-[#c9a227]">
                    <Check size={8} strokeWidth={3} />
                    ACTIVA
                  </span>
                )}

                {/* Attribute tags */}
                <div className="relative mb-3 flex flex-wrap gap-1">
                  {[attr1, attr2].filter(Boolean).map((attr) => (
                    <span
                      key={attr}
                      className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                        isActive
                          ? "bg-[#c9a227]/20 text-[#c9a227]"
                          : "bg-[#1e3320] text-[#9aab8a]"
                      }`}
                    >
                      {ATTRIBUTE_LABELS[attr] ?? attr}
                    </span>
                  ))}
                </div>

                {/* Name + inspiration */}
                <div className="relative mb-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <ClassIcon
                      size={18}
                      strokeWidth={1.5}
                      className={isActive ? "text-[#c9a227]" : "text-[#9aab8a]"}
                    />
                    <h3
                      className={`font-serif text-base font-bold leading-tight ${
                        isActive ? "text-[#c9a227] uppercase" : "text-[#f5f0e8]"
                      }`}
                    >
                      {cls.title}
                    </h3>
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-[#9aab8a]/60 mt-0.5">
                    {cls.inspiration}
                  </p>
                </div>

                {/* Description preview */}
                <p className="relative flex-1 text-[11px] leading-relaxed text-[#9aab8a] line-clamp-3">
                  {cls.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Popup */}
      <AnimatePresence>
        {openClass && (
          <motion.div
            key="popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
            onClick={handleClose}
          >
            <motion.div
              key="popup-content"
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 24 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm"
            >
              {/* Decorative corner ornaments */}
              <div className="pointer-events-none absolute -top-2 -left-2 h-8 w-8 border-t-2 border-l-2 border-[#c9a227]/60 rounded-tl-lg" />
              <div className="pointer-events-none absolute -top-2 -right-2 h-8 w-8 border-t-2 border-r-2 border-[#c9a227]/60 rounded-tr-lg" />
              <div className="pointer-events-none absolute -bottom-2 -left-2 h-8 w-8 border-b-2 border-l-2 border-[#c9a227]/60 rounded-bl-lg" />
              <div className="pointer-events-none absolute -bottom-2 -right-2 h-8 w-8 border-b-2 border-r-2 border-[#c9a227]/60 rounded-br-lg" />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute -top-4 -right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#1e3320] bg-[#0d1a0f] text-[#9aab8a] transition-colors hover:border-[#c9a227]/40 hover:text-[#f5f0e8]"
              >
                <X size={14} />
              </button>

              {/* Flip card container */}
              <div
                className="relative"
                style={{ perspective: "1200px", height: "420px" }}
              >
                <motion.div
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                  style={{ transformStyle: "preserve-3d", position: "relative", height: "100%" }}
                >
                  {/* FRONT FACE */}
                  <CardFace backface={false}>
                    <ClassCardFront
                      cls={openClass}
                      isActive={openClass.slug === activeClassSlug}
                      onFlip={() => setFlipped(true)}
                    />
                  </CardFace>

                  {/* BACK FACE */}
                  <CardFace backface={true}>
                    <ClassCardBack
                      cls={openClass}
                      onFlip={() => setFlipped(false)}
                    />
                  </CardFace>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function CardFace({
  backface,
  children,
}: {
  backface: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        position: backface ? "absolute" : "relative",
        inset: backface ? 0 : undefined,
        transform: backface ? "rotateY(180deg)" : undefined,
        height: "100%",
      }}
    >
      {children}
    </div>
  );
}

function ClassCardFront({
  cls,
  isActive,
  onFlip,
}: {
  cls: FormativeClassEntry;
  isActive: boolean;
  onFlip: () => void;
}) {
  const ClassIcon = CLASS_ICONS[cls.slug] ?? BookOpen;
  const [attr1, attr2] = cls.attributes;

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-[#1e3320] bg-[#0d1a0f] p-6 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
      {/* Background watermark */}
      <ClassIcon
        size={200}
        strokeWidth={0.5}
        className="absolute -bottom-8 -right-8 pointer-events-none text-[#9aab8a]/5"
      />

      {/* Header row */}
      <div className="relative mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isActive ? "bg-[#c9a227]/20" : "bg-[#1e3320]"}`}>
            <ClassIcon size={22} strokeWidth={1.5} className={isActive ? "text-[#c9a227]" : "text-[#9aab8a]"} />
          </div>
          <div>
            <h3 className={`font-serif text-xl font-bold leading-tight ${isActive ? "text-[#c9a227]" : "text-[#f5f0e8]"}`}>
              {cls.title}
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-[#9aab8a]/70 mt-0.5">
              {cls.inspiration}
            </p>
          </div>
        </div>
        {isActive && (
          <span className="flex items-center gap-1 rounded-full bg-[#c9a227]/20 px-2 py-1 text-[9px] font-semibold text-[#c9a227]">
            <Check size={8} strokeWidth={3} />
            ACTIVA
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="relative mb-4 h-px bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent" />

      {/* Attributes */}
      <div className="relative mb-4 flex gap-2">
        {[attr1, attr2].filter(Boolean).map((attr) => (
          <span
            key={attr}
            className="rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#c9a227]"
          >
            {ATTRIBUTE_LABELS[attr] ?? attr}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="relative flex-1 text-[13px] leading-relaxed text-[#9aab8a]">
        {cls.description}
      </p>

      {/* Footer */}
      <div className="relative mt-4 flex items-center gap-2">
        <button
          onClick={onFlip}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#c9a227]/30 bg-[#c9a227]/10 py-2.5 text-xs font-medium text-[#c9a227] transition-colors hover:bg-[#c9a227]/20"
        >
          <RotateCcw size={12} strokeWidth={2} />
          Ver versículo
        </button>
      </div>
    </div>
  );
}

function ClassCardBack({
  cls,
  onFlip,
}: {
  cls: FormativeClassEntry;
  onFlip: () => void;
}) {
  const ClassIcon = CLASS_ICONS[cls.slug] ?? BookOpen;

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-xl border border-[#c9a227]/30 bg-[#0d1a0f] p-6 shadow-[0_0_60px_rgba(0,0,0,0.8)] text-center">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.06)_0%,transparent_70%)]" />

      {/* Top ornament */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#c9a227]/50 to-transparent" />

      {/* Icon */}
      <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10">
        <ClassIcon size={28} strokeWidth={1.2} className="text-[#c9a227]" />
      </div>

      {/* Class title */}
      <p className="relative mb-1 text-[10px] font-medium uppercase tracking-[0.25em] text-[#9aab8a]/60">
        {cls.title}
      </p>

      {/* Divider */}
      <div className="relative mb-5 mt-2 h-px w-16 bg-gradient-to-r from-transparent via-[#c9a227]/40 to-transparent" />

      {/* Verse */}
      <blockquote className="relative mb-4 flex-1 flex flex-col items-center justify-center">
        <p className="font-serif text-base leading-relaxed text-[#f5f0e8] italic">
          "{cls.verse_text ?? "Versículo no configurado."}"
        </p>
        {cls.verse_reference && (
          <cite className="mt-3 block text-[11px] not-italic text-[#c9a227]/80 tracking-wider">
            — {cls.verse_reference}
          </cite>
        )}
      </blockquote>

      {/* Bottom ornament */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#c9a227]/50 to-transparent" />

      {/* Flip back */}
      <button
        onClick={onFlip}
        className="relative mt-4 flex items-center gap-2 rounded-lg border border-[#1e3320] bg-[#1a2e1c] px-4 py-2.5 text-xs font-medium text-[#9aab8a] transition-colors hover:border-[#c9a227]/40 hover:text-[#c9a227]"
      >
        <RotateCcw size={12} strokeWidth={2} />
        Volver
      </button>
    </div>
  );
}
