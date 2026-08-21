import { Timestamp, type DocumentData } from "firebase/firestore";

import type { Attendance } from "../../_types/attendance";
import type { Course } from "../../_types/course";
import type { Enrollment, EnrollmentStatus } from "../../_types/enrollment";
import type { Group } from "../../_types/group";
import type { Lesson } from "../../_types/lesson";
import type { Mentor } from "../../_types/mentor";
import type { Student } from "../../_types/student";
import type { SuperAdmin } from "../../_types/super-admin";

type Mapper<T> = (id: string, data: DocumentData) => T | null;

const enrollmentStatuses = new Set<EnrollmentStatus>([
  "active",
  "paused",
  "completed",
  "cancelled",
]);

function stringValue(data: DocumentData, key: string) {
  const value = data[key];
  return typeof value === "string" ? value : null;
}

function optionalStringValue(data: DocumentData, key: string) {
  const value = data[key];
  return typeof value === "string" ? value : undefined;
}

function optionalNonEmptyStringValue(data: DocumentData, key: string) {
  const value = optionalStringValue(data, key);
  return value && value.trim() ? value : undefined;
}

function booleanValue(data: DocumentData, key: string) {
  const value = data[key];
  return typeof value === "boolean" ? value : null;
}

function optionalNumberValue(data: DocumentData, key: string) {
  const value = data[key];
  return typeof value === "number" ? value : undefined;
}

function optionalStringArrayValue(data: DocumentData, key: string) {
  const value = data[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.every((item) => typeof item === "string") ? value : [];
}

function timestampValue(data: DocumentData, key: string) {
  const value = data[key];
  return value instanceof Timestamp ? value : null;
}

function optionalTimestampValue(data: DocumentData, key: string) {
  const value = data[key];
  return value instanceof Timestamp ? value : undefined;
}

function enrollmentStatusValue(data: DocumentData, key: string) {
  const value = data[key];
  return typeof value === "string" &&
    enrollmentStatuses.has(value as EnrollmentStatus)
    ? (value as EnrollmentStatus)
    : null;
}

export const mapCourse: Mapper<Course> = (id, data) => {
  const name = stringValue(data, "name");
  const active = booleanValue(data, "active");
  const createdAt = timestampValue(data, "createdAt");

  if (!name || active === null || !createdAt) {
    return null;
  }

  return {
    id,
    name,
    description: optionalStringValue(data, "description"),
    mentorIds: optionalStringArrayValue(data, "mentorIds"),
    active,
    createdAt,
    updatedAt: optionalTimestampValue(data, "updatedAt"),
  };
};

export const mapGroup: Mapper<Group> = (id, data) => {
  const courseId = stringValue(data, "courseId");
  const mentorId = stringValue(data, "mentorId");
  const active = booleanValue(data, "active");
  const createdAt = timestampValue(data, "createdAt");

  if (!courseId || !mentorId || active === null || !createdAt) {
    return null;
  }

  return {
    id,
    courseId,
    name: optionalStringValue(data, "name"),
    mentorId,
    active,
    createdAt,
    updatedAt: optionalTimestampValue(data, "updatedAt"),
  };
};

export const mapLesson: Mapper<Lesson> = (id, data) => {
  const courseId = stringValue(data, "courseId");
  const groupId = stringValue(data, "groupId");
  const date = timestampValue(data, "date");
  const createdAt = timestampValue(data, "createdAt");

  if (!courseId || !groupId || !date || !createdAt) {
    return null;
  }

  return {
    id,
    courseId,
    groupId,
    title: optionalStringValue(data, "title"),
    description: optionalStringValue(data, "description"),
    date,
    createdAt,
    updatedAt: optionalTimestampValue(data, "updatedAt"),
  };
};

export const mapEnrollment: Mapper<Enrollment> = (id, data) => {
  const studentId = stringValue(data, "studentId");
  const courseId = stringValue(data, "courseId");
  const groupId = optionalNonEmptyStringValue(data, "groupId");
  const mentorId = optionalNonEmptyStringValue(data, "mentorId");
  const price = optionalNumberValue(data, "price");
  const status = enrollmentStatusValue(data, "status");
  const enrolledAt = timestampValue(data, "enrolledAt");

  if (
    !studentId ||
    !courseId ||
    !status ||
    !enrolledAt
  ) {
    return null;
  }

  return {
    id,
    studentId,
    courseId,
    groupId,
    mentorId,
    price,
    status,
    enrolledAt,
    completedAt: optionalTimestampValue(data, "completedAt"),
  };
};

export const mapAttendance: Mapper<Attendance> = (id, data) => {
  const studentId = stringValue(data, "studentId");
  const courseId = stringValue(data, "courseId");
  const groupId = stringValue(data, "groupId");
  const lessonId = stringValue(data, "lessonId");
  const attendedAt = timestampValue(data, "attendedAt");

  if (!studentId || !courseId || !groupId || !lessonId || !attendedAt) {
    return null;
  }

  return {
    id,
    studentId,
    courseId,
    groupId,
    lessonId,
    attendedAt,
  };
};

export const mapStudent: Mapper<Student> = (id, data) => {
  const name = stringValue(data, "name");
  const lastName = stringValue(data, "lastName");
  const createdAt = timestampValue(data, "createdAt");

  if (!name || !lastName || !createdAt) {
    return null;
  }

  return {
    id,
    name,
    lastName,
    email: optionalStringValue(data, "email"),
    phone: optionalStringValue(data, "phone"),
    createdAt,
    updatedAt: optionalTimestampValue(data, "updatedAt"),
  };
};

export const mapMentor: Mapper<Mentor> = (id, data) => {
  const name = stringValue(data, "name");
  const lastName = stringValue(data, "lastName");
  const active = booleanValue(data, "active");
  const createdAt = timestampValue(data, "createdAt");

  if (!name || !lastName || active === null || !createdAt) {
    return null;
  }

  return {
    id,
    name,
    lastName,
    email: optionalStringValue(data, "email"),
    phone: optionalStringValue(data, "phone"),
    active,
    createdAt,
  };
};

export const mapSuperAdmin: Mapper<SuperAdmin> = (id, data) => {
  return {
    id,
    name: optionalStringValue(data, "name"),
    lastName: optionalStringValue(data, "lastName"),
    email: optionalStringValue(data, "email"),
    createdAt: optionalTimestampValue(data, "createdAt"),
  };
};
