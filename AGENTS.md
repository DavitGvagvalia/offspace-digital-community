# AGENTS.md

# Offspace Digital Community — Schedule MVP

## Project Scope

The current website is **not the full Offspace platform**.

For now, the only product functionality being built is the **schedule and attendance system** for Offspace Digital Community.

Do not expand the product into unrelated school-management features unless explicitly requested.

The MVP must support two authenticated user roles:

- Student
- Teacher

The system should feel simple, calm, fast, and easy to understand.

---

# 1. Authentication

The application must contain account login for:

- Students
- Teachers

After authentication, users should be routed to the interface appropriate for their role.

A student must not see teacher-only functionality.

A teacher must not see management interfaces for groups or students that are not assigned to them.

Do not add admin functionality unless explicitly requested.

---

# 2. Teacher Experience

The teacher interface is centered around the students and groups assigned to that teacher.

## Teacher Navigation

The teacher dashboard should contain a **vertical list/sidebar** of:

- Groups assigned to the teacher
- Private / 1-on-1 students assigned to the teacher

The sidebar is the teacher's main navigation.

Groups and private students should be visually distinguishable, but they can live in the same navigation structure.

Example conceptual structure:

```text
My Students

Groups
- Web Development — Group A
- UI/UX — Group B

Private Students
- Anna K.
- Giorgi M.
```

Do not treat this example naming as final UI copy.

---

## Teacher Group View

When a teacher clicks a group, open that group's workspace.

The workspace must contain:

1. Schedule
2. Attendance list / attendance sheet

The schedule belongs specifically to the selected group.

The attendance sheet belongs specifically to the selected group and its students.

The teacher should be able to understand:

- when lessons happen
- which lesson/date is being viewed
- which students belong to the group
- attendance status for each student

Do not add unrelated group-management tools unless requested.

---

## Teacher Private Student View

When a teacher clicks a private student, open that student's workspace.

The workspace must contain:

1. Schedule
2. Attendance list / attendance sheet

The schedule represents the lessons between that teacher and that private student.

Attendance should be tracked for those lessons in the same general system used for groups.

A private student can conceptually be treated as a one-student teaching assignment, but the UI should still make it obvious that this is a private student rather than a group.

---

# 3. Student Experience

The student interface is centered around the courses the student currently has.

## Student Schedule Navigation

The student's schedule page should contain a **horizontal list of all courses** assigned to that student.

Conceptual example:

```text
[ Web Development ] [ UI/UX ] [ Photography ]
```

The course list should behave like tabs or another clear horizontal selector.

The selected course determines what schedule and attendance information is displayed.

---

## Student Course View

When a student clicks a course, display:

1. Schedule for that course
2. Student's attendance sheet for that course

The student should only see their own attendance information.

They should not see attendance information for other students in their group.

The schedule should clearly communicate upcoming and past lessons.

The attendance section should clearly connect attendance records to lesson dates.

---

# 4. Core Information Hierarchy

The interface should follow this basic hierarchy.

## Teacher

```text
Teacher Account
└── Assigned Teaching Entities
    ├── Group
    │   ├── Schedule
    │   └── Attendance
    │
    └── Private Student
        ├── Schedule
        └── Attendance
```

## Student

```text
Student Account
└── Courses
    └── Selected Course
        ├── Schedule
        └── Personal Attendance
```

---

# 5. Core Data Concepts

Implementation details may change, but the application should be designed around the following concepts.

## User

A user should at minimum have:

- id
- name
- role

Roles currently required:

- `student`
- `teacher`

---

## Course

Represents a subject/direction such as:

- Web Development
- UI/UX
- Graphic Design
- Photography
- Back-End Development

A course is not necessarily the same thing as a group.

Multiple groups may eventually belong to the same course.

---

## Group

A group represents a collection of students learning together.

A group should conceptually contain:

- id
- name
- course
- teacher
- students
- lessons / schedule
- attendance records

---

## Private Teaching Assignment

Represents a teacher teaching one student privately.

It should conceptually connect:

- teacher
- student
- course
- schedule
- attendance records

Do not unnecessarily duplicate scheduling logic between groups and private students if they can share a common model.

---

## Lesson

A scheduled lesson should conceptually contain:

- id
- teaching assignment / group
- date
- start time
- end time
- course
- status

Possible lesson states may eventually include:

- upcoming
- completed
- cancelled

Only implement states currently required by the UI.

---

## Attendance

Attendance must be associated with a specific lesson and student.

Conceptually:

```text
Lesson + Student -> Attendance Status
```

Possible statuses can include:

- present
- absent
- late
- excused
- not marked

Do not assume every status must be implemented immediately. Start with the smallest useful attendance model unless requirements expand.

---

# 6. Permissions

Permissions are important.

## Teacher Permissions

A teacher may access:

- groups assigned to that teacher
- private students assigned to that teacher
- schedules for those assignments
- attendance for those assignments

A teacher must not access another teacher's assignments unless future requirements explicitly allow it.

---

## Student Permissions

A student may access:

- courses assigned to that student
- schedules for those courses
- only their own attendance records

Students must not be able to view another student's attendance.

---

# 7. UI Direction

The project uses the Offspace Digital Community visual identity.

The interface should feel:

- modern
- calm
- friendly
- spacious
- practical
- community-oriented
- premium without looking corporate

Avoid:

- generic school-management-dashboard aesthetics
- excessive tables everywhere
- overly dense enterprise UI
- childish educational design
- unnecessary visual noise

The primary Offspace brand color is:

```css
#123524
```

Use the existing Tailwind theme/design tokens from the project rather than introducing random one-off colors.

Prefer Tailwind utility classes over large custom CSS component classes.

---

# 8. Responsive Behavior

The application should work on desktop and mobile.

## Teacher Sidebar

On larger screens:

- keep the groups/private students list vertically visible where practical

On smaller screens:

- the vertical navigation may become a drawer, sheet, selector, or other mobile-friendly navigation

Do not force a desktop sidebar into a narrow mobile viewport.

---

## Student Course Navigation

The student course selector should remain horizontal.

On smaller screens it may:

- scroll horizontally
- use snap behavior
- use compact tabs

Avoid wrapping a large number of courses into a confusing multi-row navigation.

---

# 9. Component Philosophy

Prefer small reusable components.

Likely concepts include:

```text
TeacherSidebar
TeachingEntityList
GroupListItem
PrivateStudentListItem

CourseTabs
CourseTab

ScheduleView
LessonCard
LessonList

AttendanceSheet
AttendanceRow
AttendanceStatus

TeacherDashboard
StudentDashboard
```

These names are suggestions, not mandatory API contracts.

Do not create abstractions before they are useful.

Favor simple composition over complex generic component systems.

---

# 10. Schedule UI

The schedule is one of the two central features of this MVP.

Prioritize clarity over decoration.

Each scheduled lesson should make it easy to identify:

- date
- start time
- end time
- course/group context
- lesson status when relevant

The design may later support calendar views, but do not assume a complex calendar library is required.

A simple chronological schedule is acceptable and may be preferable for the MVP.

---

# 11. Attendance UI

Attendance is the second central feature of this MVP.

For teachers, attendance should make it quick to associate students with a specific lesson/date.

For students, attendance should be read-only unless requirements explicitly change.

Teacher attendance UI may eventually support editing, but keep interactions simple.

Avoid spreadsheet-level complexity unless explicitly requested.

---

# 12. Routing Direction

The exact Next.js route structure can evolve.

A reasonable conceptual structure is:

```text
/login

/teacher
/teacher/group/[groupId]
/teacher/student/[studentId]

/student
/student/course/[courseId]
```

Do not treat this route structure as immutable.

Role-aware layouts may be used if they simplify the application.

---

# 13. MVP Boundaries

Unless explicitly requested, do **not** build:

- admin dashboard
- payment system
- Discord integration
- messaging
- homework management
- file uploads
- certificates
- teacher payroll
- student onboarding questionnaires
- public course marketplace
- marketing landing-page functionality
- grading system
- parent accounts
- notifications
- video lessons
- complex analytics
- full LMS functionality

Those may exist later, but they are outside the current scheduling MVP.

---

# 14. Development Priorities

When making implementation decisions, prioritize in this order:

1. Correct role-based access
2. Clear teacher/student navigation
3. Reliable schedule data
4. Reliable attendance data
5. Simple responsive UX
6. Consistent Offspace styling
7. Reusable components
8. Advanced visual polish

Do not sacrifice data clarity or permissions for animations or decorative UI.

---

# 15. Current Product Definition

The current product can be summarized as:

> A role-based schedule and attendance web application for Offspace Digital Community, where teachers manage the schedules and attendance of their assigned groups and private students, while students browse their courses and view the schedule and personal attendance for each course.

This definition should be treated as the source of truth for the current MVP unless the project owner explicitly changes the scope.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
