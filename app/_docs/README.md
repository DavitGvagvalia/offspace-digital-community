# Offspace Documentation

This directory contains documentation for the current Offspace Digital Community schedule and attendance app.

The documentation is split by audience:

- [_code-documentation](./_code-documentation/README.md): engineering documentation for setup, architecture, data access, auth, and validation.
- [_usage-documentation](./_usage-documentation/README.md): user documentation for the current portal flows.

## Scope

These docs describe the behavior currently confirmed in this repository. The product is a role-based schedule and attendance web app backed by Firebase Auth and Cloud Firestore.

Confirmed portals:

- Student
- Mentor
- Super-admin

The repository guidance in `AGENTS.md` defines the MVP around student and mentor schedule/attendance flows. The current code also exposes a super-admin portal from `/` and includes user management screens, so the super-admin flow is documented as existing current behavior.

## Verification Sources

Use these files as the primary sources when updating documentation:

- `README.md`
- `AGENTS.md`
- `package.json`
- `firestore.rules`
- `app/page.tsx`
- `app/components/use-required-profile.ts`
- `app/components/portal-login.tsx`
- `app/_data/*`
- `app/_lib/firebase/*`
- `app/student/*`
- `app/mentor/*`
- `app/super-admin/*`

