# Application Architecture

## Routing

The app uses the Next.js App Router under `app/`.

Current routes confirmed from files:

| Route | Purpose |
| --- | --- |
| `/` | Public entry point with portal links. |
| `/student/login` | Student email/password login. |
| `/student/register` | Student self-registration. |
| `/student` | Student hub. |
| `/student/lessons` | Student schedule and personal attendance. |
| `/student/courses` | Student enrolled courses. |
| `/student/profile` | Student read-only profile. |
| `/mentor/login` | Mentor email/password login. |
| `/mentor` | Mentor assigned-group dashboard. |
| `/super-admin/login` | Super-admin email/password login. |
| `/super-admin` | Super-admin student and mentor profile access management. |

## Client-Side Auth Boundary

Auth-protected portal pages use `useRequiredProfile(role)` from `app/components/use-required-profile.ts`.

The hook:

- Subscribes to Firebase Auth state.
- Redirects unauthenticated users to the matching login route.
- Looks up the role-specific profile document using the authenticated user's UID.
- Signs the user out if the expected role profile does not exist.

Role profile lookup is centralized in `app/_data/portal-access.repository.ts`.

## Shared Login Component

`app/components/portal-login.tsx` renders login pages for all roles.

After Firebase Auth sign-in, it verifies profile access with `hasPortalAccess(role, user.uid)` before routing to the portal.

## Data Access Layers

The code uses three levels of data access:

- Shared repositories in `app/_data/*.repository.ts`.
- Feature data modules in `app/student/_data`, `app/mentor/_data`, and `app/super-admin/_data`.
- UI components that call feature data modules.

Prefer adding Firestore collection/path logic in repositories. Avoid duplicating Firestore path strings inside UI components.

## Firebase Utilities

`app/_lib/firebase/firestore-utils.ts` provides common document helpers:

- `listDocuments`
- `getDocument`
- `createDocument`
- `updateDocument`
- `deleteDocument`
- `formatFirebaseDate`
- `generateUUID`

`app/_lib/firebase/firestore-mappers.ts` validates Firestore documents before they are used by the app. Invalid or incomplete documents map to `null` and are filtered out by repository calls.

## Styling

Global design tokens and Tailwind theme values live in `app/globals.css`.

The primary brand color is `#123524`. Prefer Tailwind utilities and the existing color tokens over adding one-off CSS.

