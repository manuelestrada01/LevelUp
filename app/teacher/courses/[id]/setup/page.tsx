import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { getCourseById, isTeacherOfCourse, getCourseworkConfig } from "@/lib/supabase/courses";
import { getAuthSession } from "@/lib/session";
import { getCourseWorkList } from "@/lib/google/classroom";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CourseSetupTable from "@/docente/components/CourseSetupTable";

export default async function CourseSetupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const email = session?.user?.email ?? "";
  const { id } = await params;

  const allowed = await isTeacherOfCourse(id, email);
  if (!allowed) notFound();

  const course = await getCourseById(id);
  if (!course) notFound();

  const authSession = await getAuthSession();
  if (!authSession) notFound();

  const [classroomWork, savedConfigs] = await Promise.all([
    getCourseWorkList(authSession.accessToken, course.classroom_id),
    getCourseworkConfig(id),
  ]);

  const configMap = new Map(savedConfigs.map((c) => [c.classroom_coursework_id, c]));

  const items = classroomWork.map((cw) => ({
    classroom_coursework_id: cw.id!,
    title: cw.title ?? cw.id!,
    tipo: configMap.get(cw.id!)?.tipo ?? null,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/teacher/courses/${id}`}
          className="flex items-center gap-1 text-sm text-[#9aab8a] hover:text-[#f5f0e8]"
        >
          <ArrowLeft size={14} />
          {course.name}
        </Link>
      </div>

      <div>
        <h1 className="font-serif text-2xl text-[#f5f0e8]">Configurar Tareas</h1>
        <p className="mt-1 text-sm text-[#9aab8a]">
          Asigná un tipo de producción a cada tarea de Classroom para que el sistema pueda calcular XP.
        </p>
      </div>

      <CourseSetupTable courseId={id} items={items} />
    </div>
  );
}
