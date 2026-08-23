import { getStudent } from "../../_data/students.repository";

export async function getStudentProfile(uid: string) {
  return getStudent(uid);
}
