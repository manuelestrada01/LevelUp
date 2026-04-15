import { auth } from "@/auth";
import { getCoursesByTeacher } from "@/lib/supabase/courses";
import { getAllStudentGameStates } from "@/lib/supabase/game";
import { getAuthSession } from "@/lib/session";
import { getCourses } from "@/lib/google/classroom";
import CourseCard from "@/docente/components/CourseCard";
import AddCourseForm from "@/docente/components/AddCourseForm";

export default async function CoursesPage() {
  const session = await auth();
  const email = session?.user?.email ?? "";

  const authSession = await getAuthSession();
  const [courses, classroomCourses] = await Promise.all([
    getCoursesByTeacher(email),
    authSession ? getCourses(authSession.accessToken, "teacher") : Promise.resolve([]),
  ]);

  const registeredIds = new Set(courses.map((c) => c.classroom_id));
  const availableToAdd = classroomCourses.filter((c) => !registeredIds.has(c.id!));

  const coursesWithStats = await Promise.all(
    courses.map(async (course) => {
      const states = await getAllStudentGameStates(course.id, course.bimestre_activo);
      return { course, studentCount: states.length };
    })
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-gradient-to-r from-transparent via-[rgba(160,125,55,0.45)] to-transparent" />
          <span className="text-[11px] font-serif uppercase tracking-[0.38em] text-[rgba(160,125,55,0.5)]">✦ ✦ ✦</span>
          <div className="h-px flex-1 bg-gradient-to-r from-[rgba(160,125,55,0.25)] to-transparent" />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-[rgba(232,224,208,0.92)]">Cursos</h1>
        <p className="text-sm font-serif text-[rgba(160,125,55,0.55)]">
          Gestioná tus cursos registrados en el sistema
        </p>
      </div>

      {coursesWithStats.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-serif text-lg font-semibold text-[rgba(232,224,208,0.88)]">Cursos Registrados</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[rgba(160,125,55,0.22)] to-transparent" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coursesWithStats.map(({ course, studentCount }) => (
              <CourseCard key={course.id} course={course} studentCount={studentCount} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-serif text-lg font-semibold text-[rgba(232,224,208,0.88)]">Agregar Curso de Classroom</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[rgba(160,125,55,0.22)] to-transparent" />
        </div>
        {availableToAdd.length === 0 ? (
          <p className="text-sm text-[#9aab8a]">
            {classroomCourses.length === 0
              ? "No se encontraron cursos activos en Classroom."
              : "Todos tus cursos de Classroom ya están registrados."}
          </p>
        ) : (
          <AddCourseForm availableCourses={availableToAdd} />
        )}
      </section>
    </div>
  );
}
