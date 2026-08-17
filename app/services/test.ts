import { Timestamp } from "firebase/firestore";

import { addAttendance } from "./attendance.services";
import { addCourse } from "./courses.services";
import { addEnrollment } from "./enrollments.services";
import { addGroup } from "./groups.services";
import { addLesson } from "./lessons.services";
import { addMentor } from "./mentors.services";
import { addStudent } from "./students.services";

const sampleCourses = [
  {
    name: "Web Development",
    description: "Frontend fundamentals and practical web app building.",
    active: true,
  },
  {
    name: "UI/UX Design",
    description: "Product design, interface systems, and portfolio practice.",
    active: true,
  },
];

const sampleMentors = [
  {
    name: "Nino",
    lastName: "Beridze",
    email: "nino.beridze@example.com",
    phone: "+995 555 010 101",
    active: true,
  },
  {
    name: "Giorgi",
    lastName: "Kapanadze",
    email: "giorgi.kapanadze@example.com",
    phone: "+995 555 010 202",
    active: true,
  },
];

const sampleStudents = [
  {
    name: "Ana",
    lastName: "Kiknadze",
    email: "ana.kiknadze@example.com",
    phone: "+995 555 020 101",
  },
  {
    name: "Luka",
    lastName: "Maisuradze",
    email: "luka.maisuradze@example.com",
    phone: "+995 555 020 202",
  },
  {
    name: "Mariam",
    lastName: "Tsintsadze",
    email: "mariam.tsintsadze@example.com",
    phone: "+995 555 020 303",
  },
];

function lessonDate(date: string) {
  return Timestamp.fromDate(new Date(date));
}

async function createSampleCourses() {
  const courses = [];

  for (const course of sampleCourses) {
    courses.push(await addCourse(course));
  }

  return courses;
}

async function createSampleMentors() {
  const mentors = [];

  for (const mentor of sampleMentors) {
    mentors.push(await addMentor(mentor));
  }

  return mentors;
}

async function createSampleStudents() {
  const students = [];

  for (const student of sampleStudents) {
    students.push(await addStudent(student));
  }

  return students;
}

async function createSampleGroups(
  courses: Awaited<ReturnType<typeof createSampleCourses>>,
  mentors: Awaited<ReturnType<typeof createSampleMentors>>,
) {
  const groups = [];

  groups.push(
    await addGroup({
      courseId: courses[0].id,
      mentorId: mentors[0].id,
      name: "Group A",
      active: true,
    }),
  );

  groups.push(
    await addGroup({
      courseId: courses[1].id,
      mentorId: mentors[1].id,
      name: "Group B",
      active: true,
    }),
  );

  return groups;
}

async function createSampleLessons(
  groups: Awaited<ReturnType<typeof createSampleGroups>>,
) {
  const lessons = [];

  lessons.push(
    await addLesson({
      courseId: groups[0].courseId,
      groupId: groups[0].id,
      title: "HTML and CSS Foundations",
      description: "Structure, semantic markup, and layout basics.",
      date: lessonDate("2026-08-24T14:00:00+04:00"),
    }),
  );

  lessons.push(
    await addLesson({
      courseId: groups[0].courseId,
      groupId: groups[0].id,
      title: "JavaScript Basics",
      description: "Variables, functions, events, and DOM interactions.",
      date: lessonDate("2026-08-26T14:00:00+04:00"),
    }),
  );

  lessons.push(
    await addLesson({
      courseId: groups[1].courseId,
      groupId: groups[1].id,
      title: "User Flow Mapping",
      description: "Mapping course discovery and signup journeys.",
      date: lessonDate("2026-08-25T16:00:00+04:00"),
    }),
  );

  lessons.push(
    await addLesson({
      courseId: groups[1].courseId,
      groupId: groups[1].id,
      title: "Wireframe Review",
      description: "Low-fidelity screens and critique workflow.",
      date: lessonDate("2026-08-27T16:00:00+04:00"),
    }),
  );

  return lessons;
}

async function createSampleEnrollments(
  students: Awaited<ReturnType<typeof createSampleStudents>>,
  groups: Awaited<ReturnType<typeof createSampleGroups>>,
) {
  const enrollments = [];

  enrollments.push(
    await addEnrollment({
      studentId: students[0].id,
      courseId: groups[0].courseId,
      groupId: groups[0].id,
      mentorId: groups[0].mentorId,
      price: 250,
      status: "active",
    }),
  );

//   enrollments.push(
//     await addEnrollment({
//       studentId: students[1].id,
//       courseId: groups[0].courseId,
//       groupId: groups[0].id,
//       mentorId: groups[0].mentorId,
//       price: 250,
//       status: "active",
//     }),
//   );

//   enrollments.push(
//     await addEnrollment({
//       studentId: students[2].id,
//       courseId: groups[1].courseId,
//       groupId: groups[1].id,
//       mentorId: groups[1].mentorId,
//       price: 300,
//       status: "active",
//     }),
//   );

  return enrollments;
}

async function createSampleAttendance(
  students: Awaited<ReturnType<typeof createSampleStudents>>,
  groups: Awaited<ReturnType<typeof createSampleGroups>>,
  lessons: Awaited<ReturnType<typeof createSampleLessons>>,
) {
  const attendance = [];

  attendance.push(
    await addAttendance({
      studentId: students[0].id,
      courseId: groups[0].courseId,
      groupId: groups[0].id,
      lessonId: lessons[0].id,
    }),
  );

  attendance.push(
    await addAttendance({
      studentId: students[1].id,
      courseId: groups[0].courseId,
      groupId: groups[0].id,
      lessonId: lessons[0].id,
    }),
  );

  attendance.push(
    await addAttendance({
      studentId: students[2].id,
      courseId: groups[1].courseId,
      groupId: groups[1].id,
      lessonId: lessons[2].id,
    }),
  );

  return attendance;
}

async function seedSampleData() {
    let students = [{id:"Hd36HDkyVQcIg1z6g9ef"}] as Awaited<ReturnType<typeof createSampleStudents>>;
    let groups = [{courseId: "KoYWoE48553iO7XIEHe0",id: "XxeApJI3o2NPNJX0FV0r",
      mentorId:"eMvX8joQo1xrJEHSPrQr"}] as Awaited<ReturnType<typeof createSampleGroups>>;
//   const courses = await createSampleCourses();
//   const mentors = await createSampleMentors();
//   const students = await createSampleStudents();
//   const groups = await createSampleGroups(courses, mentors);
//   const lessons = await createSampleLessons(groups);
  const enrollments = await createSampleEnrollments(students, groups);
//   const attendance = await createSampleAttendance(students, groups, lessons);

//   return {
//     courses,
//     mentors,
//     students,
//     groups,
//     lessons,
//     enrollments,
//     attendance,
//   };
}

seedSampleData()
  .then((result) => {
    console.log("Sample data created successfully.");
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error: unknown) => {
    console.error("Failed to create sample data.");
    console.error(error);
    process.exitCode = 1;
  });

export {
  createSampleAttendance,
  createSampleCourses,
  createSampleEnrollments,
  createSampleGroups,
  createSampleLessons,
  createSampleMentors,
  createSampleStudents,
  seedSampleData,
};
