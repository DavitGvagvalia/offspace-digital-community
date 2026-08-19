# Data Model

This app reads and writes Cloud Firestore using the Firebase Web SDK.

## Collections

### `Students/{studentId}`

`studentId` must match the Firebase Auth UID for normal student access.

Required fields used by the mapper:

- `name: string`
- `lastName: string`
- `createdAt: Timestamp`

Optional fields:

- `email: string`
- `phone: string`
- `updatedAt: Timestamp`

### `Mentors/{mentorId}`

`mentorId` must match the Firebase Auth UID for mentor portal access.

Required fields used by the mapper:

- `name: string`
- `lastName: string`
- `active: boolean`
- `createdAt: Timestamp`

Optional fields:

- `email: string`
- `phone: string`

### `SuperAdmins/{superAdminId}`

`superAdminId` must match the Firebase Auth UID for super-admin portal access.

Optional fields used by the mapper:

- `name: string`
- `lastName: string`
- `email: string`
- `createdAt: Timestamp`

Firestore rules deny client create, update, delete, and list operations for `SuperAdmins`. Super-admin bootstrap must happen outside this client app.

### `Courses/{courseId}`

Required fields:

- `name: string`
- `active: boolean`
- `createdAt: Timestamp`

Optional fields:

- `description: string`
- `updatedAt: Timestamp`

### `Courses/{courseId}/Groups/{groupId}`

Required fields:

- `courseId: string`
- `mentorId: string`
- `active: boolean`
- `createdAt: Timestamp`

Optional fields:

- `name: string`
- `updatedAt: Timestamp`

### `Courses/{courseId}/Groups/{groupId}/Lessons/{lessonId}`

Required fields:

- `courseId: string`
- `groupId: string`
- `date: Timestamp`
- `createdAt: Timestamp`

Optional fields:

- `title: string`
- `description: string`
- `updatedAt: Timestamp`

### `Enrollments/{enrollmentId}`

Required fields:

- `studentId: string`
- `courseId: string`
- `groupId: string`
- `mentorId: string`
- `price: number`
- `status: "active" | "paused" | "completed" | "cancelled"`
- `enrolledAt: Timestamp`

Optional fields:

- `completedAt: Timestamp`

Firestore rules include a helper that expects enrollment IDs in the format:

```text
{studentId}_{groupId}
```

Keep this format if code or data writes enrollments used by Security Rules.

### `Attendances/{attendanceId}`

Required fields:

- `studentId: string`
- `courseId: string`
- `groupId: string`
- `lessonId: string`
- `attendedAt: Timestamp`

`app/_data/attendance.repository.ts` creates attendance IDs in the format:

```text
{studentId}_{lessonId}
```

That makes one attendance record per student per lesson. Creating the same attendance again overwrites the same document ID.

## Mapper Behavior

Firestore mappers live in `app/_lib/firebase/firestore-mappers.ts`.

Each mapper returns `null` if required fields are missing or have the wrong type. Repository list calls filter out `null` results, so malformed documents can disappear from UI without a visible error.

When changing schema fields, update all of these together:

- Shared type in `app/_types`.
- Mapper in `app/_lib/firebase/firestore-mappers.ts`.
- Repository write shape.
- Firestore rules in `firestore.rules`.
- Relevant UI display and empty/error states.

