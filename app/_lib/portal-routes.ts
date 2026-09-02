import type { PortalRole } from "../_types/auth";

const portalDashboardPath: Record<PortalRole, string> = {
  student: "/student",
  mentor: "/mentor",
  "super-admin": "/super-admin",
};

const portalLoginPath: Record<PortalRole, string> = {
  student: "/student/login",
  mentor: "/mentor/login",
  "super-admin": "/super-admin/login",
};

export { portalDashboardPath, portalLoginPath };
