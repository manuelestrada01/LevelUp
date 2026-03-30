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
      <div>
        <h1 className="font-serif text-2xl text-[#f5f0e8]">Cursos</h1>
        <p className="mt-1 text-sm text-[#9aab8a]">
          Gestioná tus cursos registrados en el sistema
        </p>
      </div>

      {coursesWithStats.length > 0 && (
        <section>
          <h2 className="mb-4 font-serif text-lg text-[#f5f0e8]">Cursos Registrados</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coursesWithStats.map(({ course, studentCount }) => (
              <CourseCard key={course.id} course={course} studentCount={studentCount} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 font-serif text-lg text-[#f5f0e8]">Agregar Curso de Classroom</h2>
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
