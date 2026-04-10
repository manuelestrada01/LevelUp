"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { motion } from "framer-motion";
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
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import type { FormativeClassEntry } from "@/lib/supabase/classes";

gsap.registerPlugin(useGSAP);

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

interface ClasesFormativasViewProps {
  activeClassSlug: string;
  classes: FormativeClassEntry[];
}

export default function ClasesFormativasView({
  activeClassSlug,
  classes,
}: ClasesFormativasViewProps) {
  const [openClass, setOpenClass] = useState<FormativeClassEntry | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!overlayRef.current || !popupRef.current) return;

      if (isOpen) {
        gsap.set(overlayRef.current, { display: "flex" });

        const tl = gsap.timeline();
        tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "none" });
        tl.fromTo(
          popupRef.current,
          { opacity: 0, scale: 0.82, y: 44 },
          { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.6)" },
          "-=0.1"
        );
        tl.fromTo(
          "[data-corner]",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, stagger: 0.06, duration: 0.28, ease: "back.out(3)" },
          "-=0.4"
        );
        tl.fromTo(
          "[data-el]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, stagger: 0.07, duration: 0.35, ease: "power3.out" },
          "-=0.3"
        );
      } else if (openClass) {
        const tl = gsap.timeline({
          onComplete: () => {
            setOpenClass(null);
            setFlipped(false);
            gsap.set(overlayRef.current!, { display: "none" });
          },
        });
        tl.to(popupRef.current, { opacity: 0, scale: 0.9, y: 24, duration: 0.2, ease: "power2.in" });
        tl.to(overlayRef.current, { opacity: 0, duration: 0.18, ease: "none" }, "-=0.1");
      }
    },
    { scope: overlayRef, dependencies: [isOpen] }
  );

  function handleOpen(cls: FormativeClassEntry, e: React.MouseEvent) {
    gsap
      .timeline()
      .to(e.currentTarget, { scale: 0.95, duration: 0.1, ease: "power2.in" })
      .to(e.currentTarget, { scale: 1, duration: 0.4, ease: "back.out(2.5)" });

    setOpenClass(cls);
    setIsOpen(true);
    setFlipped(false);
  }

  function handleClose() {
    setIsOpen(false);
  }

  const activeClass = classes.find((c) => c.slug === activeClassSlug) ?? null;
  const otherClasses = classes.filter((c) => c.slug !== activeClassSlug);

  if (classes.length === 0) return null;

  return (
    <>
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mb-8 flex flex-col items-center text-center"
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[#c9a227]/30 bg-[#c9a227]/10">
          <GraduationCap size={24} strokeWidth={1.5} className="text-[#c9a227]" />
        </div>
        <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.25em] text-[#9aab8a]">
          Especialización de Gremio
        </p>
        <h1 className="font-serif text-3xl font-bold text-[#f5f0e8]">Clases Formativas</h1>
        <p className="mt-3 max-w-[400px] text-[11px] leading-relaxed text-[#9aab8a]/70 italic">
          "Porque muchos son llamados, más pocos son los escogidos."
          <br />
          <span className="not-italic">— Arquetipos del Conocimiento</span>
        </p>
      </motion.div>

      {/* Active class hero */}
      {activeClass && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
            Tu Clase Activa
          </p>
          <HeroClassCard cls={activeClass} onOpen={handleOpen} />
        </motion.div>
      )}

      {/* Divider */}
      {activeClass && otherClasses.length > 0 && (
        <div className="mb-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#1e3320]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9aab8a]/50">
            Todas las Clases
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#1e3320]" />
        </div>
      )}

      {/* Grid of other classes */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(activeClass ? otherClasses : classes).map((cls, index) => (
          <motion.div
            key={cls.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.07, duration: 0.4, ease: "easeOut" }}
          >
            <GridClassCard cls={cls} isActive={false} onOpen={handleOpen} />
          </motion.div>
        ))}
      </div>

      {/* Flip-card modal overlay — always in DOM, GSAP controls visibility */}
      <div
        ref={overlayRef}
        style={{ display: "none" }}
        className="fixed inset-0 z-50 items-center justify-center bg-black/75 backdrop-blur-sm p-4"
        onClick={handleClose}
      >
        <div
          ref={popupRef}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-sm"
        >
          {/* Corner ornaments */}
          <div data-corner className="pointer-events-none absolute -top-2 -left-2 h-8 w-8 border-t-2 border-l-2 border-[#c9a227]/60 rounded-tl-lg" />
          <div data-corner className="pointer-events-none absolute -top-2 -right-2 h-8 w-8 border-t-2 border-r-2 border-[#c9a227]/60 rounded-tr-lg" />
          <div data-corner className="pointer-events-none absolute -bottom-2 -left-2 h-8 w-8 border-b-2 border-l-2 border-[#c9a227]/60 rounded-bl-lg" />
          <div data-corner className="pointer-events-none absolute -bottom-2 -right-2 h-8 w-8 border-b-2 border-r-2 border-[#c9a227]/60 rounded-br-lg" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute -top-4 -right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#1e3320] bg-[#0d1a0f] text-[#9aab8a] transition-colors hover:border-[#c9a227]/40 hover:text-[#f5f0e8]"
          >
            <X size={14} />
          </button>

          {openClass && (
            <div className="relative" style={{ perspective: "1200px", height: "420px" }}>
              <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                style={{ transformStyle: "preserve-3d", position: "relative", height: "100%" }}
              >
                <CardFace backface={false}>
                  <ClassCardFront
                    cls={openClass}
                    isActive={openClass.slug === activeClassSlug}
                    onFlip={() => setFlipped(true)}
                  />
                </CardFace>
                <CardFace backface={true}>
                  <ClassCardBack cls={openClass} onFlip={() => setFlipped(false)} />
                </CardFace>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Hero card for the active class ── */
function HeroClassCard({
  cls,
  onOpen,
}: {
  cls: FormativeClassEntry;
  onOpen: (cls: FormativeClassEntry, e: React.MouseEvent) => void;
}) {
  const ClassIcon = CLASS_ICONS[cls.slug] ?? BookOpen;
  const [attr1, attr2] = cls.attributes;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={(e) => onOpen(cls, e)}
      className="relative mx-auto max-w-2xl cursor-pointer overflow-hidden rounded-2xl border border-[#c9a227]/50 bg-[#c9a227]/8 p-6 shadow-[0_0_60px_rgba(201,162,39,0.08)]"
    >
      {/* Background icon */}
      <ClassIcon
        size={260}
        strokeWidth={0.4}
        className="absolute -bottom-10 -right-10 pointer-events-none text-[#c9a227]/8"
      />

      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.07)_0%,transparent_60%)]" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        {/* Icon badge */}
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl border border-[#c9a227]/40 bg-[#c9a227]/15">
          <ClassIcon size={34} strokeWidth={1.3} className="text-[#c9a227]" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Active badge */}
          <div className="mb-2 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-[#c9a227]/20 px-2.5 py-1 text-[10px] font-semibold text-[#c9a227]">
              <Check size={9} strokeWidth={3} />
              ACTIVA
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#9aab8a]/50">
              {cls.inspiration}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-serif text-2xl font-bold uppercase text-[#c9a227] leading-tight mb-3">
            {cls.title}
          </h2>

          {/* Attributes */}
          <div className="mb-4 flex flex-wrap gap-2">
            {[attr1, attr2].filter(Boolean).map((attr) => (
              <span
                key={attr}
                className="rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#c9a227]"
              >
                {ATTRIBUTE_LABELS[attr] ?? attr}
              </span>
            ))}
          </div>

          {/* Description — full, no line-clamp */}
          <p className="text-[13px] leading-relaxed text-[#9aab8a]">{cls.description}</p>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="relative mt-4 flex items-center justify-center gap-1.5 border-t border-[#c9a227]/10 pt-4">
        <RotateCcw size={11} className="text-[#c9a227]/50" />
        <span className="text-[10px] text-[#c9a227]/50">Ver versículo bíblico</span>
      </div>
    </motion.div>
  );
}

/* ── Grid card for non-active classes ── */
function GridClassCard({
  cls,
  isActive,
  onOpen,
}: {
  cls: FormativeClassEntry;
  isActive: boolean;
  onOpen: (cls: FormativeClassEntry, e: React.MouseEvent) => void;
}) {
  const ClassIcon = CLASS_ICONS[cls.slug] ?? BookOpen;
  const [attr1, attr2] = cls.attributes;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={(e) => onOpen(cls, e)}
      className={`relative flex cursor-pointer flex-col overflow-hidden rounded-xl border p-5 transition-colors ${
        isActive
          ? "border-[#c9a227]/60 bg-[#c9a227]/10"
          : "border-[#1e3320] bg-[#0F2411] hover:border-[#8fbc8f]/30"
      }`}
    >
      {/* Background icon */}
      <ClassIcon
        size={120}
        strokeWidth={0.6}
        className={`absolute -top-4 -right-4 pointer-events-none transition-all duration-500 ${
          isActive ? "text-[#c9a227]/12 scale-110" : "text-[#9aab8a]/8"
        }`}
      />

      {isActive && (
        <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-[#c9a227]/20 px-1.5 py-0.5 text-[9px] font-semibold text-[#c9a227]">
          <Check size={8} strokeWidth={3} />
          ACTIVA
        </span>
      )}

      {/* Attributes */}
      <div className="relative mb-3 flex flex-wrap gap-1.5">
        {[attr1, attr2].filter(Boolean).map((attr) => (
          <span
            key={attr}
            className={`rounded px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
              isActive ? "bg-[#c9a227]/20 text-[#c9a227]" : "bg-[#1e3320] text-[#9aab8a]"
            }`}
          >
            {ATTRIBUTE_LABELS[attr] ?? attr}
          </span>
        ))}
      </div>

      {/* Title row */}
      <div className="relative mb-2 flex items-center gap-2">
        <ClassIcon
          size={20}
          strokeWidth={1.4}
          className={isActive ? "text-[#c9a227]" : "text-[#9aab8a]"}
        />
        <div>
          <h3
            className={`font-serif text-lg font-bold leading-tight ${
              isActive ? "text-[#c9a227] uppercase" : "text-[#f5f0e8]"
            }`}
          >
            {cls.title}
          </h3>
          <p className="text-[10px] uppercase tracking-wider text-[#9aab8a]/55 mt-0.5">
            {cls.inspiration}
          </p>
        </div>
      </div>

      {/* Description — full, no line-clamp */}
      <p className="relative flex-1 text-[12px] leading-relaxed text-[#9aab8a]">
        {cls.description}
      </p>

      {/* Hint */}
      <div className="relative mt-4 flex items-center gap-1.5 border-t border-[#1e3320] pt-3">
        <RotateCcw size={10} className="text-[#9aab8a]/40" />
        <span className="text-[10px] text-[#9aab8a]/40">Ver versículo</span>
      </div>
    </motion.div>
  );
}

/* ── Shared flip-card sub-components ── */
function CardFace({ backface, children }: { backface: boolean; children: React.ReactNode }) {
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
      <ClassIcon size={200} strokeWidth={0.5} className="absolute -bottom-8 -right-8 pointer-events-none text-[#9aab8a]/5" />

      <div data-el className="relative mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isActive ? "bg-[#c9a227]/20" : "bg-[#1e3320]"}`}>
            <ClassIcon size={22} strokeWidth={1.5} className={isActive ? "text-[#c9a227]" : "text-[#9aab8a]"} />
          </div>
          <div>
            <h3 className={`font-serif text-xl font-bold leading-tight ${isActive ? "text-[#c9a227]" : "text-[#f5f0e8]"}`}>
              {cls.title}
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-[#9aab8a]/70 mt-0.5">{cls.inspiration}</p>
          </div>
        </div>
        {isActive && (
          <span className="flex items-center gap-1 rounded-full bg-[#c9a227]/20 px-2 py-1 text-[9px] font-semibold text-[#c9a227]">
            <Check size={8} strokeWidth={3} />
            ACTIVA
          </span>
        )}
      </div>

      <div data-el className="relative mb-4 h-px bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent" />

      <div data-el className="relative mb-4 flex gap-2">
        {[attr1, attr2].filter(Boolean).map((attr) => (
          <span key={attr} className="rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#c9a227]">
            {ATTRIBUTE_LABELS[attr] ?? attr}
          </span>
        ))}
      </div>

      <p data-el className="relative flex-1 text-[13px] leading-relaxed text-[#9aab8a]">{cls.description}</p>

      <div data-el className="relative mt-4">
        <button
          onClick={onFlip}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#c9a227]/30 bg-[#c9a227]/10 py-2.5 text-xs font-medium text-[#c9a227] transition-colors hover:bg-[#c9a227]/20"
        >
          <RotateCcw size={12} strokeWidth={2} />
          Ver versículo
        </button>
      </div>
    </div>
  );
}

function ClassCardBack({ cls, onFlip }: { cls: FormativeClassEntry; onFlip: () => void }) {
  const ClassIcon = CLASS_ICONS[cls.slug] ?? BookOpen;

  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-xl border border-[#c9a227]/30 bg-[#0d1a0f] p-6 shadow-[0_0_60px_rgba(0,0,0,0.8)] text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.06)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#c9a227]/50 to-transparent" />

      <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10">
        <ClassIcon size={28} strokeWidth={1.2} className="text-[#c9a227]" />
      </div>

      <p className="relative mb-1 text-[10px] font-medium uppercase tracking-[0.25em] text-[#9aab8a]/60">{cls.title}</p>
      <div className="relative mb-5 mt-2 h-px w-16 bg-gradient-to-r from-transparent via-[#c9a227]/40 to-transparent" />

      <blockquote className="relative mb-4 flex flex-1 flex-col items-center justify-center">
        <p className="font-serif text-base leading-relaxed text-[#f5f0e8] italic">
          "{cls.verse_text ?? "Versículo no configurado."}"
        </p>
        {cls.verse_reference && (
          <cite className="mt-3 block text-[11px] not-italic text-[#c9a227]/80 tracking-wider">
            — {cls.verse_reference}
          </cite>
        )}
      </blockquote>

      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#c9a227]/50 to-transparent" />

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
