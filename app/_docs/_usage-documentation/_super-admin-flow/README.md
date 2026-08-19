# Super-Admin Flow

## What Super-Admins Can Do

Super-admins can:

- Sign in to the super-admin portal.
- View student and mentor profile directories.
- Create student accounts.
- Create mentor accounts.
- Remove student or mentor profile access.

The current super-admin portal manages portal profile access. It does not provide full Firebase Auth administration from a trusted backend.

## Sign In

1. Open the home page.
2. Select `Super-admin login`.
3. Enter the super-admin email and password.
4. Select `Continue`.

If the app says the account does not have access to the super-admin portal, the signed-in Firebase account does not have a matching super-admin profile.

Super-admin profiles cannot be created from this client app. They must be bootstrapped outside the app.

## View Directories

After login, the dashboard shows:

- Students
- Mentors

Each list can show name, email, ID, phone, created date, and mentor active status where available.

## Create A Student Account

1. Use the `New student account` form.
2. Enter name, last name, email, optional phone, and password.
3. Submit the form.

The app creates a Firebase Auth user and a matching student profile document.

## Create A Mentor Account

1. Use the `New mentor account` form.
2. Enter name, last name, email, optional phone, and password.
3. Leave `Active mentor` checked unless the mentor should start inactive.
4. Submit the form.

The app creates a Firebase Auth user and a matching mentor profile document.

## Remove Portal Access

1. Find the student or mentor in the directory.
2. Select `Remove`.
3. Confirm the browser prompt.

This removes the Firestore profile document used for portal access. The Firebase Auth account remains until it is deleted from a trusted admin backend.

## Common Issues

- `Email already exists`: another Firebase Auth user already uses that email.
- `Use a stronger password`: the password does not satisfy Firebase Auth requirements.
- `Permission denied`: the signed-in account does not have permission to manage profile documents under the current Firestore rules.
- Missing directories: confirm Firestore rules, Firebase config, and the super-admin profile document.

