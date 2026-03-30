import { cache } from "react";
import { google } from "googleapis";
import type { classroom_v1 } from "googleapis";

function getClassroomClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.classroom({ version: "v1", auth });
}

export type UserRole = "teacher" | "student";

export const detectRole = cache(async function detectRoleFn(accessToken: string): Promise<UserRole> {
  const classroom = getClassroomClient(accessToken);
  const res = await classroom.courses.list({
    teacherId: "me",
    pageSize: 1,
  });
  return (res.data.courses ?? []).length > 0 ? "teacher" : "student";
});

export async function getCourses(accessToken: string, role: UserRole) {
  const classroom = getClassroomClient(accessToken);
  const res = await classroom.courses.list({
    ...(role === "teacher" ? { teacherId: "me" } : { studentId: "me" }),
    courseStates: ["ACTIVE"],
  });
  return res.data.courses ?? [];
}

export async function getCourseWork(accessToken: string, courseId: string) {
  const classroom = getClassroomClient(accessToken);
  const res = await classroom.courses.courseWork.list({
    courseId,
    orderBy: "dueDate desc",
  });
  return res.data.courseWork ?? [];
}

export async function getStudentSubmissions(accessToken: string, courseId: string) {
  const classroom = getClassroomClient(accessToken);
  const res = await classroom.courses.courseWork.studentSubmissions.list({
    courseId,
    courseWorkId: "-",
    userId: "me",
  });
  return res.data.studentSubmissions ?? [];
}

// --- Teacher-only functions ---

export async function getCourseWorkList(
  accessToken: string,
  courseId: string
): Promise<classroom_v1.Schema$CourseWork[]> {
  const classroom = getClassroomClient(accessToken);
  const res = await classroom.courses.courseWork.list({
    courseId,
    orderBy: "dueDate asc",
    pageSize: 100,
  });
  return res.data.courseWork ?? [];
}

export async function getCourseRoster(
  accessToken: string,
  courseId: string
): Promise<classroom_v1.Schema$Student[]> {
  const classroom = getClassroomClient(accessToken);
  const all: classroom_v1.Schema$Student[] = [];
  let pageToken: string | undefined;

  do {
    const res = await classroom.courses.students.list({
      courseId,
      pageSize: 100,
      pageToken,
    });
    all.push(...(res.data.students ?? []));
    pageToken = res.data.nextPageToken ?? undefined;
  } while (pageToken);

  return all;
}

export async function getAllSubmissions(
  accessToken: string,
  courseId: string,
  courseWorkIds: string[]
): Promise<classroom_v1.Schema$StudentSubmission[]> {
  const classroom = getClassroomClient(accessToken);
  const all: classroom_v1.Schema$StudentSubmission[] = [];

  await Promise.all(
    courseWorkIds.map(async (cwId) => {
      let pageToken: string | undefined;
      do {
        const res = await classroom.courses.courseWork.studentSubmissions.list({
          courseId,
          courseWorkId: cwId,
          pageSize: 100,
          pageToken,
        });
        all.push(...(res.data.studentSubmissions ?? []));
        pageToken = res.data.nextPageToken ?? undefined;
      } while (pageToken);
    })
  );

  return all;
}
