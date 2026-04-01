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
      className="flex flex-col rounded-xl border border-[#1e3320] bg-[#1a2e1c] p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-serif text-base text-[#f5f0e8]">{course.name}</p>
          {course.section && (
            <p className="mt-0.5 text-xs text-[#9aab8a]">{course.section}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Link
            href={`/teacher/courses/${course.id}/setup`}
            title="Configurar tareas"
            className="rounded p-1 text-[#9aab8a] transition-colors hover:bg-[#0d1a0f] hover:text-[#c9a227]"
          >
            <Settings size={14} />
          </Link>
          <DeleteCourseButton courseId={course.id} courseName={course.name} />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-[#9aab8a]">
        <span className="flex items-center gap-1">
          <Users size={11} />
          {studentCount} alumnos
        </span>
        <span className="rounded bg-[#0d1a0f] px-2 py-0.5 text-[#c9a227]">
          {course.bimestre_activo}
        </span>
        <span>{course.year}° año</span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <VisibilityToggle courseId={course.id} initialVisible={course.student_visible} />
        <SyncStatus courseId={course.id} />
      </div>

      <Link
        href={`/teacher/courses/${course.id}`}
        className="mt-3 block rounded-lg border border-[#c9a227]/30 px-3 py-2 text-center text-xs font-medium text-[#c9a227] transition-colors hover:bg-[#c9a227]/10"
      >
        Ver alumnos
      </Link>
    </motion.div>
  );
}
