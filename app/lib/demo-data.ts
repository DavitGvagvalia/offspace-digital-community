export type Language = "en" | "ka" | "ru";
export type AttendanceStatus = "present" | "absent" | "late" | "excused" | "notMarked";
export type LessonStatus = "upcoming" | "completed" | "cancelled";

export type Course = {
  id: string;
  title: string;
};

export type Student = {
  id: string;
  name: string;
};

export type Lesson = {
  id: string;
  assignmentId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: LessonStatus;
};

export type AttendanceRecord = {
  lessonId: string;
  studentId: string;
  status: AttendanceStatus;
};

export type GroupAssignment = {
  id: string;
  type: "group";
  name: string;
  courseId: string;
  studentIds: string[];
};

export type PrivateAssignment = {
  id: string;
  type: "private";
  studentId: string;
  courseId: string;
};

export type TeacherAssignment = GroupAssignment | PrivateAssignment;

export const languages: { id: Language; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "ka", label: "KA" },
  { id: "ru", label: "RU" },
];

export const courses: Course[] = [
  { id: "web", title: "Web Development" },
  { id: "uiux", title: "UI/UX Design" },
  { id: "photo", title: "Photography" },
];

export const students: Student[] = [
  { id: "anna", name: "Anna K." },
  { id: "giorgi", name: "Giorgi M." },
  { id: "mariam", name: "Mariam B." },
  { id: "nika", name: "Nika T." },
];

export const teacherAssignments: TeacherAssignment[] = [
  {
    id: "group-web-a",
    type: "group",
    name: "Web Development - Group A",
    courseId: "web",
    studentIds: ["anna", "giorgi", "mariam"],
  },
  {
    id: "group-uiux-b",
    type: "group",
    name: "UI/UX - Group B",
    courseId: "uiux",
    studentIds: ["giorgi", "nika"],
  },
  {
    id: "private-photo-anna",
    type: "private",
    studentId: "anna",
    courseId: "photo",
  },
];

export const studentCourseIds = ["web", "uiux", "photo"];

export const lessons: Lesson[] = [
  {
    id: "lesson-web-1",
    assignmentId: "group-web-a",
    date: "2026-08-11",
    startTime: "18:00",
    endTime: "20:00",
    status: "completed",
  },
  {
    id: "lesson-web-2",
    assignmentId: "group-web-a",
    date: "2026-08-15",
    startTime: "18:00",
    endTime: "20:00",
    status: "upcoming",
  },
  {
    id: "lesson-uiux-1",
    assignmentId: "group-uiux-b",
    date: "2026-08-12",
    startTime: "19:00",
    endTime: "21:00",
    status: "completed",
  },
  {
    id: "lesson-uiux-2",
    assignmentId: "group-uiux-b",
    date: "2026-08-17",
    startTime: "19:00",
    endTime: "21:00",
    status: "upcoming",
  },
  {
    id: "lesson-photo-1",
    assignmentId: "private-photo-anna",
    date: "2026-08-10",
    startTime: "16:00",
    endTime: "17:30",
    status: "completed",
  },
  {
    id: "lesson-photo-2",
    assignmentId: "private-photo-anna",
    date: "2026-08-16",
    startTime: "16:00",
    endTime: "17:30",
    status: "upcoming",
  },
];

export const attendanceRecords: AttendanceRecord[] = [
  { lessonId: "lesson-web-1", studentId: "anna", status: "present" },
  { lessonId: "lesson-web-1", studentId: "giorgi", status: "late" },
  { lessonId: "lesson-web-1", studentId: "mariam", status: "present" },
  { lessonId: "lesson-web-2", studentId: "anna", status: "notMarked" },
  { lessonId: "lesson-web-2", studentId: "giorgi", status: "notMarked" },
  { lessonId: "lesson-web-2", studentId: "mariam", status: "notMarked" },
  { lessonId: "lesson-uiux-1", studentId: "giorgi", status: "present" },
  { lessonId: "lesson-uiux-1", studentId: "nika", status: "excused" },
  { lessonId: "lesson-uiux-2", studentId: "giorgi", status: "notMarked" },
  { lessonId: "lesson-uiux-2", studentId: "nika", status: "notMarked" },
  { lessonId: "lesson-photo-1", studentId: "anna", status: "present" },
  { lessonId: "lesson-photo-2", studentId: "anna", status: "notMarked" },
];

export const studentAssignmentsByCourse: Record<string, string> = {
  web: "group-web-a",
  uiux: "group-uiux-b",
  photo: "private-photo-anna",
};

export function getCourse(courseId: string) {
  return courses.find((course) => course.id === courseId) ?? courses[0];
}

export function getAssignmentTitle(assignment: TeacherAssignment) {
  if (assignment.type === "group") {
    return assignment.name;
  }

  return students.find((student) => student.id === assignment.studentId)?.name ?? "Student";
}

export function getLessonsForAssignment(assignmentId: string) {
  return lessons.filter((lesson) => lesson.assignmentId === assignmentId);
}

export function getStudentsForAssignment(assignment: TeacherAssignment) {
  if (assignment.type === "private") {
    return students.filter((student) => student.id === assignment.studentId);
  }

  return students.filter((student) => assignment.studentIds.includes(student.id));
}

export function getAttendanceStatus(lessonId: string, studentId: string): AttendanceStatus {
  return (
    attendanceRecords.find(
      (record) => record.lessonId === lessonId && record.studentId === studentId,
    )?.status ?? "notMarked"
  );
}

export function formatDate(date: string, language: Language) {
  return new Intl.DateTimeFormat(getLocale(language), {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function formatShortDate(date: string, language: Language) {
  return new Intl.DateTimeFormat(getLocale(language), {
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function getLocale(language: Language) {
  const locales: Record<Language, string> = {
    en: "en-US",
    ka: "ka-GE",
    ru: "ru-RU",
  };

  return locales[language];
}
