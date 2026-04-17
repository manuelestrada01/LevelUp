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

// Wood texture


// Stone texture
const STONE_NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")";

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
        tl.fromTo(popupRef.current, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.42, ease: "power3.out" }, "-=0.1");
        tl.fromTo("[data-corner]", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.05, duration: 0.25, ease: "back.out(3)" }, "-=0.4");
        tl.fromTo("[data-el]", { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.32, ease: "power3.out" }, "-=0.3");
      } else if (openClass) {
        const tl = gsap.timeline({
          onComplete: () => {
            setOpenClass(null);
            setFlipped(false);
            gsap.set(overlayRef.current!, { display: "none" });
          },
        });
        tl.to(popupRef.current, { opacity: 0, y: 16, duration: 0.18, ease: "power2.in" });
        tl.to(overlayRef.current, { opacity: 0, duration: 0.18, ease: "none" }, "-=0.1");
      }
    },
    { scope: overlayRef, dependencies: [isOpen] }
  );

  function handleOpen(cls: FormativeClassEntry, e: React.MouseEvent) {
    gsap.timeline()
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
      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mb-8 flex flex-col items-center text-center"
      >
        {/* Heraldic icon seal */}
        <div
          className="relative mb-4 flex h-12 w-12 items-center justify-center"
          style={{
            border: "1px solid rgba(160,125,55,0.38)",
            background: "rgba(160,125,55,0.08)",
          }}
        >
          <div className="pointer-events-none absolute inset-[3px] border border-[rgba(160,125,55,0.12)]" />
          <GraduationCap size={22} strokeWidth={1.3} className="text-[#c8a84b]" />
        </div>

        <p className="mb-1 text-[11px] font-serif uppercase tracking-[0.32em] text-[rgba(160,125,55,0.5)]">
          Especialización de Gremio
        </p>
        <h1 className="font-serif text-3xl font-bold text-[rgba(232,224,208,0.9)]">Clases Formativas</h1>
        <div className="my-3 flex items-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[rgba(160,125,55,0.35)]" />
          <span className="text-[rgba(160,125,55,0.3)] text-[10px]">✦</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[rgba(160,125,55,0.35)]" />
        </div>
        <p className="max-w-[400px] text-[14px] font-serif leading-relaxed text-[rgba(160,125,55,0.4)] italic">
          "Porque muchos son llamados, más pocos son los escogidos."
          <br />
          <span className="not-italic text-[rgba(160,125,55,0.3)]">— Arquetipos del Conocimiento</span>
        </p>
      </motion.div>

      {/* ── Active class hero ── */}
      {activeClass && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.3)] to-transparent" />
            <p className="text-[11px] font-serif uppercase tracking-[0.3em] text-[#c8a84b] shrink-0">Tu Clase Activa</p>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.3)] to-transparent" />
          </div>
          <HeroClassCard cls={activeClass} onOpen={handleOpen} />
        </motion.div>
      )}

      {/* ── Section divider ── */}
      {activeClass && otherClasses.length > 0 && (
        <div className="mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.2)] to-transparent" />
          <span className="text-[9px] font-serif uppercase tracking-[0.28em] text-[rgba(160,125,55,0.4)]">
            Todas las Clases
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.2)] to-transparent" />
        </div>
      )}

      {/* ── Class grid ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(activeClass ? otherClasses : classes).map((cls, index) => (
          <motion.div
            key={cls.slug}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.07, duration: 0.38, ease: "easeOut" }}
          >
            <GridClassCard cls={cls} isActive={false} onOpen={handleOpen} />
          </motion.div>
        ))}
      </div>

      {/* ── Flip-card modal overlay ── */}
      <div
        ref={overlayRef}
        style={{ display: "none", backgroundColor: "rgba(0,0,0,0.82)" }}
        className="fixed inset-0 z-50 items-center justify-center p-4"
        onClick={handleClose}
      >
        <div
          ref={popupRef}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-sm"
          style={{ willChange: "transform, opacity" }}
        >
          {/* Iron bracket corners */}
          <div data-corner className="pointer-events-none absolute -top-2.5 -left-2.5 h-8 w-8 border-t-2 border-l-2 border-[rgba(160,125,55,0.55)]" />
          <div data-corner className="pointer-events-none absolute -top-2.5 -right-2.5 h-8 w-8 border-t-2 border-r-2 border-[rgba(160,125,55,0.55)]" />
          <div data-corner className="pointer-events-none absolute -bottom-2.5 -left-2.5 h-8 w-8 border-b-2 border-l-2 border-[rgba(160,125,55,0.55)]" />
          <div data-corner className="pointer-events-none absolute -bottom-2.5 -right-2.5 h-8 w-8 border-b-2 border-r-2 border-[rgba(160,125,55,0.55)]" />

          {/* Close button — square */}
          <button
            onClick={handleClose}
            className="absolute -top-4 -right-4 z-10 flex h-8 w-8 items-center justify-center border border-[rgba(160,125,55,0.3)] bg-[#120e08] text-[rgba(200,168,75,0.5)] hover:text-[rgba(200,168,75,1)] transition-colors"
          >
            <X size={13} />
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

/* ── Hero card — active class ── */
function HeroClassCard({ cls, onOpen }: {
  cls: FormativeClassEntry;
  onOpen: (cls: FormativeClassEntry, e: React.MouseEvent) => void;
}) {
  const ClassIcon = CLASS_ICONS[cls.slug] ?? BookOpen;
  const [attr1, attr2] = cls.attributes;

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
      onClick={(e) => onOpen(cls, e)}
      className="relative mx-auto max-w-2xl cursor-pointer overflow-hidden p-6"
      style={{
        background: `${STONE_NOISE}, linear-gradient(160deg, #131110 0%, #0d0c0b 100%)`,
        border: "1px solid rgba(160,125,55,0.48)",
        boxShadow: "0 6px 40px rgba(0,0,0,0.75), 0 0 50px rgba(200,168,75,0.05)",
      }}
    >
      {/* Inner frame */}
      <div className="pointer-events-none absolute inset-[5px] border border-[rgba(160,125,55,0.1)]" />
      {/* Corner ◆ */}
      <span className="pointer-events-none absolute top-[3px] left-[3px] text-[5px] text-[rgba(160,125,55,0.4)] leading-none select-none">◆</span>
      <span className="pointer-events-none absolute top-[3px] right-[3px] text-[5px] text-[rgba(160,125,55,0.4)] leading-none select-none">◆</span>
      <span className="pointer-events-none absolute bottom-[3px] left-[3px] text-[5px] text-[rgba(160,125,55,0.4)] leading-none select-none">◆</span>
      <span className="pointer-events-none absolute bottom-[3px] right-[3px] text-[5px] text-[rgba(160,125,55,0.4)] leading-none select-none">◆</span>

      {/* Background class icon watermark */}
      <ClassIcon size={240} strokeWidth={0.35} className="absolute -bottom-8 -right-8 pointer-events-none text-[rgba(160,125,55,0.06)]" />
      {/* Candlelight */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,168,75,0.05)_0%,transparent_55%)]" />
      {/* Top rule */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(200,168,75,0.4)] to-transparent" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        {/* Icon seal */}
        <div
          className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center"
          style={{
            border: "1px solid rgba(160,125,55,0.45)",
            background: "rgba(160,125,55,0.1)",
          }}
        >
          <div className="pointer-events-none absolute inset-[4px] border border-[rgba(160,125,55,0.12)]" />
          <ClassIcon size={32} strokeWidth={1.2} className="text-[#c8a84b]" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Active badge + inspiration */}
          <div className="mb-2 flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 border border-[rgba(160,125,55,0.4)] bg-[rgba(160,125,55,0.1)] px-2.5 py-0.5 text-[9px] font-serif uppercase tracking-[0.2em] text-[#c8a84b]">
              <Check size={8} strokeWidth={3} />
              Activa
            </span>
            <span className="text-[9px] font-serif uppercase tracking-[0.2em] text-[rgba(160,125,55,0.4)]">
              {cls.inspiration}
            </span>
          </div>

          <h2 className="font-serif text-2xl font-bold uppercase text-[#c8a84b] leading-tight mb-3">
            {cls.title}
          </h2>

          {/* Attribute chips */}
          <div className="mb-4 flex flex-wrap gap-2">
            {[attr1, attr2].filter(Boolean).map((attr) => (
              <span
                key={attr}
                className="border border-[rgba(160,125,55,0.35)] bg-[rgba(160,125,55,0.08)] px-3 py-0.5 text-[9px] font-serif uppercase tracking-[0.2em] text-[rgba(200,168,75,0.7)]"
              >
                {ATTRIBUTE_LABELS[attr] ?? attr}
              </span>
            ))}
          </div>

          <p className="text-[16px] font-serif leading-relaxed text-[rgba(160,125,55,0.55)]">{cls.description}</p>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="relative mt-4 flex items-center justify-center gap-1.5 border-t border-[rgba(160,125,55,0.15)] pt-3">
        <RotateCcw size={10} className="text-[rgba(160,125,55,0.35)]" />
        <span className="text-[9px] font-serif uppercase tracking-[0.2em] text-[rgba(160,125,55,0.35)]">
          Ver versículo bíblico
        </span>
      </div>
    </motion.div>
  );
}

/* ── Grid card ── */
function GridClassCard({ cls, isActive, onOpen }: {
  cls: FormativeClassEntry;
  isActive: boolean;
  onOpen: (cls: FormativeClassEntry, e: React.MouseEvent) => void;
}) {
  const ClassIcon = CLASS_ICONS[cls.slug] ?? BookOpen;
  const [attr1, attr2] = cls.attributes;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      onClick={(e) => onOpen(cls, e)}
      className="relative flex cursor-pointer flex-col overflow-hidden p-5 transition-all"
      style={{
        background: `${STONE_NOISE}, linear-gradient(170deg, ${isActive ? "#1c1408" : "#121109"} 0%, #0c0b07 100%)`,
        border: `1px solid ${isActive ? "rgba(160,125,55,0.48)" : "rgba(160,125,55,0.22)"}`,
        boxShadow: isActive ? "0 0 30px rgba(200,168,75,0.06)" : "none",
      }}
    >
      {/* Inner frame */}
      <div className="pointer-events-none absolute inset-[4px] border border-[rgba(160,125,55,0.07)]" />

      {/* Corner ◆ */}
      <span className="pointer-events-none absolute top-[3px] left-[3px] text-[4px] text-[rgba(160,125,55,0.3)] leading-none select-none">◆</span>
      <span className="pointer-events-none absolute top-[3px] right-[3px] text-[4px] text-[rgba(160,125,55,0.3)] leading-none select-none">◆</span>
      <span className="pointer-events-none absolute bottom-[3px] left-[3px] text-[4px] text-[rgba(160,125,55,0.3)] leading-none select-none">◆</span>
      <span className="pointer-events-none absolute bottom-[3px] right-[3px] text-[4px] text-[rgba(160,125,55,0.3)] leading-none select-none">◆</span>

      {/* Watermark icon */}
      <ClassIcon size={110} strokeWidth={0.5} className="absolute -top-3 -right-3 pointer-events-none text-[rgba(160,125,55,0.07)]" />

      {isActive && (
        <span className="absolute top-3 right-3 flex items-center gap-1 border border-[rgba(160,125,55,0.38)] bg-[rgba(160,125,55,0.1)] px-1.5 py-0.5 text-[8px] font-serif uppercase tracking-[0.2em] text-[#c8a84b]">
          <Check size={7} strokeWidth={3} />
          Activa
        </span>
      )}

      {/* Attributes */}
      <div className="relative mb-3 flex flex-wrap gap-1.5">
        {[attr1, attr2].filter(Boolean).map((attr) => (
          <span
            key={attr}
            className="border border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.07)] px-2 py-0.5 text-[8px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.55)]"
          >
            {ATTRIBUTE_LABELS[attr] ?? attr}
          </span>
        ))}
      </div>

      {/* Title row */}
      <div className="relative mb-2 flex items-center gap-2">
        <ClassIcon size={18} strokeWidth={1.3} className={isActive ? "text-[#c8a84b]" : "text-[rgba(160,125,55,0.5)]"} />
        <div>
          <h3 className={`font-serif text-base font-bold leading-tight ${isActive ? "text-[#c8a84b] uppercase" : "text-[rgba(232,224,208,0.85)]"}`}>
            {cls.title}
          </h3>
          <p className="text-[9px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.4)] mt-0.5">
            {cls.inspiration}
          </p>
        </div>
      </div>

      <p className="relative flex-1 text-[15px] font-serif leading-relaxed text-[rgba(160,125,55,0.5)]">
        {cls.description}
      </p>

      <div className="relative mt-4 flex items-center gap-1.5 border-t border-[rgba(160,125,55,0.12)] pt-3">
        <RotateCcw size={9} className="text-[rgba(160,125,55,0.28)]" />
        <span className="text-[9px] font-serif uppercase tracking-[0.18em] text-[rgba(160,125,55,0.28)]">
          Ver versículo
        </span>
      </div>
    </motion.div>
  );
}

/* ── Flip-card face wrapper ── */
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

/* ── Card front — description face ── */
function ClassCardFront({ cls, isActive, onFlip }: {
  cls: FormativeClassEntry;
  isActive: boolean;
  onFlip: () => void;
}) {
  const ClassIcon = CLASS_ICONS[cls.slug] ?? BookOpen;
  const [attr1, attr2] = cls.attributes;

  return (
    <div
      className="relative flex h-full flex-col p-6"
      style={{
        background: `${STONE_NOISE}, linear-gradient(170deg, #131110 0%, #0d0c0b 100%)`,
        border: "1px solid rgba(160,125,55,0.42)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.9)",
      }}
    >
      <div className="pointer-events-none absolute inset-[5px] border border-[rgba(160,125,55,0.1)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,168,75,0.04)_0%,transparent_55%)]" />
      <ClassIcon size={180} strokeWidth={0.45} className="absolute -bottom-6 -right-6 pointer-events-none text-[rgba(160,125,55,0.05)]" />

      <div data-el className="relative mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center"
            style={{
              border: "1px solid rgba(160,125,55,0.38)",
              background: isActive ? "rgba(160,125,55,0.15)" : "rgba(160,125,55,0.07)",
            }}
          >
            <ClassIcon size={20} strokeWidth={1.4} className={isActive ? "text-[#c8a84b]" : "text-[rgba(160,125,55,0.55)]"} />
          </div>
          <div>
            <h3 className={`font-serif text-xl font-bold leading-tight ${isActive ? "text-[#c8a84b]" : "text-[rgba(232,224,208,0.88)]"}`}>
              {cls.title}
            </h3>
            <p className="text-[9px] font-serif uppercase tracking-[0.2em] text-[rgba(160,125,55,0.4)] mt-0.5">
              {cls.inspiration}
            </p>
          </div>
        </div>
        {isActive && (
          <span className="flex items-center gap-1 border border-[rgba(160,125,55,0.38)] bg-[rgba(160,125,55,0.1)] px-2 py-0.5 text-[8px] font-serif uppercase tracking-[0.2em] text-[#c8a84b] shrink-0">
            <Check size={7} strokeWidth={3} />
            Activa
          </span>
        )}
      </div>

      <div data-el className="relative mb-4 h-px bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.3)] to-transparent" />

      <div data-el className="relative mb-4 flex gap-2 flex-wrap">
        {[attr1, attr2].filter(Boolean).map((attr) => (
          <span
            key={attr}
            className="border border-[rgba(160,125,55,0.35)] bg-[rgba(160,125,55,0.08)] px-3 py-0.5 text-[9px] font-serif uppercase tracking-[0.2em] text-[rgba(200,168,75,0.7)]"
          >
            {ATTRIBUTE_LABELS[attr] ?? attr}
          </span>
        ))}
      </div>

      <p data-el className="relative flex-1 text-[16px] font-serif leading-relaxed text-[rgba(160,125,55,0.55)]">
        {cls.description}
      </p>

      <div data-el className="relative mt-4">
        <button
          onClick={onFlip}
          className="flex w-full items-center justify-center gap-2 border border-[rgba(160,125,55,0.28)] bg-[rgba(160,125,55,0.06)] py-2.5 text-[9px] font-serif uppercase tracking-[0.25em] text-[rgba(200,168,75,0.6)] hover:text-[rgba(200,168,75,0.9)] hover:bg-[rgba(160,125,55,0.1)] transition-colors"
        >
          <RotateCcw size={11} strokeWidth={1.8} />
          Ver versículo
        </button>
      </div>
    </div>
  );
}

/* ── Card back — scripture face ── */
function ClassCardBack({ cls, onFlip }: {
  cls: FormativeClassEntry;
  onFlip: () => void;
}) {
  const ClassIcon = CLASS_ICONS[cls.slug] ?? BookOpen;

  return (
    <div
      className="relative flex h-full flex-col items-center justify-center p-6 text-center"
      style={{
        background: `${STONE_NOISE}, linear-gradient(170deg, #111814 0%, #0a100d 100%)`,
        border: "1px solid rgba(0,155,125,0.3)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.9)",
      }}
    >
      <div className="pointer-events-none absolute inset-[5px] border border-[rgba(0,155,125,0.08)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,155,125,0.04)_0%,transparent_65%)]" />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(0,155,125,0.3)] to-transparent" />

      {/* Corner ◆ */}
      <span className="pointer-events-none absolute top-[3px] left-[3px] text-[5px] text-[rgba(0,155,125,0.25)] leading-none select-none">◆</span>
      <span className="pointer-events-none absolute top-[3px] right-[3px] text-[5px] text-[rgba(0,155,125,0.25)] leading-none select-none">◆</span>
      <span className="pointer-events-none absolute bottom-[3px] left-[3px] text-[5px] text-[rgba(0,155,125,0.25)] leading-none select-none">◆</span>
      <span className="pointer-events-none absolute bottom-[3px] right-[3px] text-[5px] text-[rgba(0,155,125,0.25)] leading-none select-none">◆</span>

      {/* Icon seal */}
      <div
        className="relative mb-4 flex h-14 w-14 items-center justify-center"
        style={{ border: "1px solid rgba(0,155,125,0.28)", background: "rgba(0,155,125,0.06)" }}
      >
        <div className="pointer-events-none absolute inset-[4px] border border-[rgba(0,155,125,0.1)]" />
        <ClassIcon size={26} strokeWidth={1.2} className="text-[rgba(0,185,150,0.8)]" />
      </div>

      <p className="relative mb-1 text-[9px] font-serif uppercase tracking-[0.3em] text-[rgba(0,155,125,0.5)]">
        {cls.title}
      </p>
      <div className="relative mb-4 mt-2 w-16 h-px bg-gradient-to-r from-transparent via-[rgba(0,155,125,0.3)] to-transparent" />

      <blockquote className="relative mb-4 flex flex-1 flex-col items-center justify-center">
        <span className="font-serif text-[48px] font-bold text-[rgba(200,168,75,0.2)] leading-none mb-[-16px] self-start ml-2 select-none">❝</span>
        <p className="font-serif text-sm leading-relaxed text-[rgba(232,224,208,0.7)] italic px-2">
          {cls.verse_text ?? "Versículo no configurado."}
        </p>
        {cls.verse_reference && (
          <cite className="mt-3 flex items-center gap-2 text-[10px] not-italic font-serif text-[rgba(200,168,75,0.5)] tracking-wider">
            <span className="text-[rgba(0,155,125,0.4)] text-[8px]">✠</span>
            {cls.verse_reference}
            <span className="text-[rgba(0,155,125,0.4)] text-[8px]">✠</span>
          </cite>
        )}
      </blockquote>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(0,155,125,0.25)] to-transparent" />

      <button
        onClick={onFlip}
        className="relative mt-4 flex items-center gap-2 border border-[rgba(160,125,55,0.25)] bg-[rgba(160,125,55,0.06)] px-4 py-2.5 text-[9px] font-serif uppercase tracking-[0.22em] text-[rgba(160,125,55,0.5)] hover:text-[rgba(200,168,75,0.8)] transition-colors"
      >
        <RotateCcw size={11} strokeWidth={1.8} />
        Volver
      </button>
    </div>
  );
}
