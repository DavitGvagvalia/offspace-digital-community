import { StudentLessonsView } from "./student-lessons-view";

const DEFAULT_STUDENT_ID = "Hd36HDkyVQcIg1z6g9ef";

type LessonsPageProps = {
  searchParams?: Promise<{
    studentId?: string | string[];
  }>;
};

function getStudentId(searchParams?: { studentId?: string | string[] }) {
  const studentId = searchParams?.studentId;

  if (Array.isArray(studentId)) {
    return studentId[0] ?? DEFAULT_STUDENT_ID;
  }

  return studentId ?? DEFAULT_STUDENT_ID;
}

export default async function LessonsPage({ searchParams }: LessonsPageProps) {
  const params = await searchParams;
  const studentId = getStudentId(params);

  return <StudentLessonsView studentId={studentId} />;
}
