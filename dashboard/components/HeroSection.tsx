import { FormativeClass, CLASS_LABELS } from "@/clases-formativas/types";

interface HeroSectionProps {
  studentName: string;
  formativeClass: FormativeClass;
}

const CLASS_HERO_TEXT: Record<FormativeClass, string> = {
  barbaro: "La fuerza que portas ilumina el sendero. Sostén el esfuerzo y el camino se abrirá ante ti.",
  bardo: "Tu voz resuena en el gremio. Inspira con cada trazo y eleva el espíritu del aula.",
  clerigo: "El discernimiento es tu guía. Mantén la resonancia alta para desbloquear nuevos fragmentos de sabiduría.",
  paladin: "La convicción sostiene tu avance. Mantén la rectitud y el próximo nivel aguarda.",
  druida: "Observas los procesos donde otros solo ven urgencia. La paciencia es tu mayor fortaleza.",
  erudito: "Las sendas del conocimiento se iluminan ante tu presencia. Mantén la resonancia alta para desbloquear nuevos fragmentos de sabiduría.",
};

export default function HeroSection({ studentName, formativeClass }: HeroSectionProps) {
  const classLabel = CLASS_LABELS[formativeClass].toUpperCase();

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-[#1e3320]"
      style={{ minHeight: "400px" }}
    >
      {/* Background image layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/images/bosque.png')",
          backgroundPosition: "center 65%",
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#031706]/80 via-[#031706]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#031706]/50 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full flex h-full flex-col justify-center px-6 py-10">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#9aab8a]">
          Bienvenido de vuelta, {classLabel}
        </p>
        <h1 className="font-serif text-5xl font-bold leading-tight text-[#f5f0e8] max-w-2xl">
          Tu progreso en el nexo
          <br />
          técnico continúa,{" "}
          <em className="text-[#c9a227] not-italic font-semibold">{studentName}.</em>
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-[#9aab8a]">
          {CLASS_HERO_TEXT[formativeClass]}
        </p>
      </div>
    </div>
  );
}
