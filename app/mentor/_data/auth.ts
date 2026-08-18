import { getMentor } from "../../_data/mentors.repository";

export async function getMentorProfile(uid: string) {
  return getMentor(uid);
}
