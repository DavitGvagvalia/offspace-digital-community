# Code Documentation

Engineering documentation for the Offspace Digital Community schedule and attendance app.

## Contents

- [Project Overview](./project-overview.md)
- [Setup And Validation](./setup-and-validation.md)
- [Application Architecture](./application-architecture.md)
- [Data Model](./data-model.md)
- [Authentication And Authorization](./authentication-and-authorization.md)
- [Feature Flows](./feature-flows.md)

## Engineering Principles For This Repository

- Treat Firebase Auth UID as the source of identity.
- Derive student, mentor, and super-admin authorization from profile documents, not from route params or user-entered IDs.
- Keep Firestore access behind repository/data modules.
- Use explicit Firestore mappers for user-facing data.
- Keep scope focused on schedule, attendance, role login, and role dashboards unless the project owner explicitly expands it.
- Validate changes with the narrowest useful command, and use broader validation for shared or structural changes.

