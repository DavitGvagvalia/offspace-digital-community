import type {
  PortalProfileByRole,
  PortalRole,
} from "../_types/auth";
import { getMentor } from "./mentors.repository";
import { getStudent } from "./students.repository";
import { getSuperAdmin } from "./super-admins.repository";

export async function getPortalProfile<T extends PortalRole>(
  role: T,
  uid: string,
): Promise<PortalProfileByRole<T> | null> {
  if (role === "student") {
    return (await getStudent(uid)) as PortalProfileByRole<T> | null;
  }

  if (role === "mentor") {
    return (await getMentor(uid)) as PortalProfileByRole<T> | null;
  }

  return (await getSuperAdmin(uid)) as PortalProfileByRole<T> | null;
}

export async function hasPortalAccess(role: PortalRole, uid: string) {
  return Boolean(await getPortalProfile(role, uid));
}
