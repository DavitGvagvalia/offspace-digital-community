import { mapSuperAdmin } from "../_lib/firebase/firestore-mappers";
import { getDocument } from "../_lib/firebase/firestore-utils";
import type { SuperAdmin } from "../_types/super-admin";

const SUPER_ADMINS_COLLECTION = "SuperAdmins";

const getSuperAdmin = async (id: string) =>
  getDocument<SuperAdmin>(SUPER_ADMINS_COLLECTION, id, mapSuperAdmin);

export { getSuperAdmin };
