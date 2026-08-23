# Student And Mentor Flow

Active auth provider: Supabase Auth.

Student flow:

```text
/ -> /student/login -> Supabase Auth -> verify student profile -> /student
```

Mentor flow:

```text
/ -> /mentor/login -> Supabase Auth -> verify mentor profile -> /mentor
```

Student reads derive `studentId` from `auth.users.id`. Mentor reads derive
`mentorId` from `auth.users.id`.
