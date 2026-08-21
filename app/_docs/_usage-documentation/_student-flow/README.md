# Student Flow

## What Students Can Do

Students can:

- Create a student account.
- Sign in to the student portal.
- Open the student hub.
- Select one or more active courses when they have no existing enrollments.
- View enrolled courses.
- See when an enrolled course is waiting for group assignment.
- View past lessons conducted in their assigned group.
- View their own boolean attendance status for those lessons.
- View their read-only profile.

Students cannot edit courses, lessons, attendance, or profile details in the current MVP. Changing already selected courses is intentionally deferred until after the first MVP behavior is implemented.

## Create A Student Account

1. Open the home page.
2. Select `Student registration`.
3. Enter name, last name, email, optional phone, password, and password confirmation.
4. Submit the form.
5. After successful registration, the app opens the student hub.

If registration fails, check that:

- The email address is valid.
- The password has at least 6 characters.
- The password and confirmation match.
- The email is not already registered.

## Sign In

1. Open the home page.
2. Select `Student login`.
3. Enter the student email and password.
4. Select `Continue`.

If the app says the account does not have access to the student portal, the signed-in Firebase account does not have a matching student profile.

## Student Hub

The student hub links to:

- Lessons
- Courses
- Profile

If the signed-in student has no existing enrollments, the student hub should also show an available-course selection block.

The course-selection block should:

- List active available courses.
- Allow selecting multiple courses.
- Create one active enrollment per selected course.
- Allow enrollment even before group assignment.

If a selected course does not have a group assigned to the student yet, student-facing pages should show:

```text
Your mentor will assign group soon.
```

## Lessons

Open `Lessons` from the student hub.

The lessons page shows enrolled courses.

For a course with an assigned group, the lessons page should show a vertical timeline of past lessons conducted in that group. Each lesson should expose details on hover and on tap/click for touch devices:

- Lesson date.
- Attendance status for the signed-in student.

Attendance is boolean for the MVP:

- Attended.
- Not attended.

For a course without an assigned group, the lessons page should show the group-assignment message instead of an empty timeline.

If no courses appear, no enrollments were found for the student account.

## Courses

Open `Courses` from the student hub.

The courses page shows course enrollment details loaded from the student's enrollments. Depending on the stored data, a course card can include course, group, mentor, enrollment status, price, and enrollment date details.

The courses page is also the intended place for students to browse active available courses and enroll in additional courses after the initial no-enrollment flow.

## Profile

Open `Profile` from the student hub.

The profile page is read-only and can show:

- Name
- Last name
- Email
- Phone

Ask the Offspace team if profile details need to be corrected.
