"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Sparkles } from "lucide-react";

gsap.registerPlugin(useGSAP);

interface LevelUpOverlayProps {
  level: number;
  levelName: string;
  email: string;
}

export default function LevelUpOverlay({ level, levelName, email }: LevelUpOverlayProps) {
  const [show, setShow] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const storageKey = `levelup_seen_${email}`;

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(storageKey) ?? "0", 10);
    if (stored > 0 && level > stored) {
      setShow(true);
    }
    localStorage.setItem(storageKey, String(level));
  }, []);

  useGSAP(
    () => {
      if (!show || !overlayRef.current) return;
      gsap
        .timeline()
        .fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "power2.out" }
        )
        .fromTo(
          cardRef.current,
          { opacity: 0, scale: 0.72, y: 40 },
          { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.4)" },
          "-=0.25"
        );
    },
    { dependencies: [show] }
  );

  function dismiss() {
    if (!overlayRef.current) {
      setShow(false);
      return;
    }
    gsap
      .timeline({ onComplete: () => setShow(false) })
      .to(cardRef.current, { opacity: 0, scale: 0.88, duration: 0.25, ease: "power2.in" })
      .to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.1");
  }

  if (!show) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={dismiss}
    >
      {/* Radial burst */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.14)_0%,transparent_55%)]" />

      <div
        ref={cardRef}
        className="relative w-full max-w-sm px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner accents */}
        <div className="pointer-events-none absolute -top-2 -left-2 h-10 w-10 border-t-2 border-l-2 border-[#c9a227]/60 rounded-tl-xl" />
        <div className="pointer-events-none absolute -top-2 -right-2 h-10 w-10 border-t-2 border-r-2 border-[#c9a227]/60 rounded-tr-xl" />
        <div className="pointer-events-none absolute -bottom-2 -left-2 h-10 w-10 border-b-2 border-l-2 border-[#c9a227]/60 rounded-bl-xl" />
        <div className="pointer-events-none absolute -bottom-2 -right-2 h-10 w-10 border-b-2 border-r-2 border-[#c9a227]/60 rounded-br-xl" />

        <div className="relative flex flex-col items-center overflow-hidden rounded-xl border border-[#c9a227]/30 bg-[#0d1a0f] px-10 py-10 shadow-[0_0_120px_rgba(201,162,39,0.12)] text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.07)_0%,transparent_70%)]" />
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-[#c9a227]/60 to-transparent" />

          {/* Icon */}
          <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#c9a227]/40 bg-[#c9a227]/10">
            <Sparkles size={28} strokeWidth={1.2} className="text-[#c9a227]" />
          </div>

          {/* Label */}
          <p className="relative text-[10px] font-medium uppercase tracking-[0.35em] text-[#9aab8a]/60 mb-3">
            ¡Nuevo Nivel Alcanzado!
          </p>

          {/* Level number */}
          <p className="relative font-serif text-8xl font-bold text-[#c9a227] leading-none mb-2">
            {level}
          </p>

          {/* Level name */}
          <p className="relative font-serif text-xl text-[#f5f0e8] mb-1">{levelName}</p>

          <div className="relative my-5 h-px w-24 bg-gradient-to-r from-transparent via-[#c9a227]/40 to-transparent" />

          <p className="relative text-xs text-[#9aab8a]/70 mb-7 leading-relaxed">
            Tu conocimiento y esfuerzo te han llevado más lejos.
          </p>

          <button
            onClick={dismiss}
            className="relative rounded-md border border-[#c9a227]/30 bg-[#c9a227]/10 px-8 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-[#c9a227] transition-all hover:bg-[#c9a227]/20 hover:border-[#c9a227]/50"
          >
            Continuar
          </button>

          <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-[#c9a227]/60 to-transparent" />
        </div>
      </div>
    </div>
  );
}
