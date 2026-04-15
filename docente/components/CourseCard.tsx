"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Settings } from "lucide-react";
import { Course } from "@/lib/supabase/courses";
import SyncStatus from "./SyncStatus";
import VisibilityToggle from "./VisibilityToggle";
import DeleteCourseButton from "./DeleteCourseButton";

interface Props {
  course: Course;
  studentCount: number;
  index?: number;
}

export default function CourseCard({ course, studentCount, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="chronicle-stone relative flex flex-col p-5"
    >
      {/* Corner ◆ marks */}
      <span className="pointer-events-none absolute top-[3px] left-[3px] text-[5px] text-[rgba(160,125,55,0.35)] leading-none select-none z-10">◆</span>
      <span className="pointer-events-none absolute top-[3px] right-[3px] text-[5px] text-[rgba(160,125,55,0.35)] leading-none select-none z-10">◆</span>
      <span className="pointer-events-none absolute bottom-[3px] left-[3px] text-[5px] text-[rgba(160,125,55,0.35)] leading-none select-none z-10">◆</span>
      <span className="pointer-events-none absolute bottom-[3px] right-[3px] text-[5px] text-[rgba(160,125,55,0.35)] leading-none select-none z-10">◆</span>
      {/* Candlelight glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.04)_0%,transparent_60%)]" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="font-serif text-base text-[rgba(232,224,208,0.92)]">{course.name}</p>
          {course.section && (
            <p className="mt-0.5 text-xs font-serif text-[rgba(160,125,55,0.6)]">{course.section}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Link
            href={`/teacher/courses/${course.id}/setup`}
            title="Configurar tareas"
            className="p-1 text-[rgba(160,125,55,0.5)] transition-colors hover:text-[rgba(200,168,75,0.9)]"
          >
            <Settings size={14} />
          </Link>
          <DeleteCourseButton courseId={course.id} courseName={course.name} />
        </div>
      </div>

      <div className="relative z-10 mt-3 flex items-center gap-3 text-xs font-serif text-[rgba(160,125,55,0.6)]">
        <span className="flex items-center gap-1">
          <Users size={11} />
          {studentCount} alumnos
        </span>
        <span className="border border-[rgba(160,125,55,0.3)] bg-[rgba(160,125,55,0.06)] px-2 py-0.5 text-[rgba(200,168,75,0.75)]">
          {course.bimestre_activo}
        </span>
        <span>{course.year}° año</span>
      </div>

      <div className="relative z-10 mt-2 flex items-center justify-between">
        <VisibilityToggle courseId={course.id} initialVisible={course.student_visible} />
        <SyncStatus courseId={course.id} />
      </div>

      <Link
        href={`/teacher/courses/${course.id}`}
        className="relative z-10 mt-3 block border border-[rgba(160,125,55,0.35)] bg-[rgba(160,125,55,0.05)] px-3 py-2 text-center text-xs font-serif uppercase tracking-[0.18em] text-[rgba(200,168,75,0.7)] transition-colors hover:border-[rgba(200,168,75,0.55)] hover:bg-[rgba(160,125,55,0.1)]"
      >
        Ver alumnos
      </Link>
    </motion.div>
  );
}
