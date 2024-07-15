# Training Program

> The trainee has to make an MVP note app and document the process.

## Tech Stack
- **FE:** ReactJS / TypeScript / react-router-dom / @tanstack/react-query / styled-components / @testing-library/react / Formik
- **BE:** Django
- **DB:** Postgres

## Requirements
- Document (following template) → required to estimate tasks.
- Write unit tests for both FE & BE.
- Actively discuss requirements, technical issues, and documentation writing via meeting/Skype/call.
- Report: Daily progress report through Skype, demo work at the end of each week.

## User Stories

### User Story #1: User Login
As a user, I want to log into my account so that I can access my personal data.

#### Acceptance Criteria:
1. The user can navigate to the login page.
2. The user can enter their username and password.
3. The user can click a "Login" button to authenticate.
4. The user receives an error message if the login fails.
5. The user is redirected to their dashboard upon successful login.

### User Story #2: User Signup
As a new user, I want to create an account so that I can start using the application.

#### Acceptance Criteria:
1. The user can navigate to the signup page.
2. The user can enter their personal information (e.g., name, email, password).
3. The user can click a "Sign Up" button to create their account.
4. The user receives a confirmation email after signing up.
5. The user can click a link in the confirmation email to verify their account.

### User Story #3: Role & Permission Management
As an administrator, I want to manage user roles and permissions so that I can control access to different features and data within the application.

#### Acceptance Criteria:
1. The administrator can navigate to the role management page.
2. The administrator can create new roles with specific permissions (create & update / delete / view).
3. The administrator can assign roles to users.
4. The administrator can modify permissions for existing roles.
5. The administrator can delete roles that are no longer needed.
6. Users can access features and data based on their assigned roles and permissions.

### User Story #4: Create Note
As a user, I want to create a new note so that I can capture and organize my thoughts and information.

#### Acceptance Criteria:
1. The user can click a "New Note" button to create a new note.
2. The user can enter and format text within the note.
3. The user can save the note for future reference.
4. The user can view a list of all saved notes.

### User Story #5: Edit Note
As a user, I want to edit an existing note so that I can update or correct information.

#### Acceptance Criteria:
1. The user can select a note from the list of saved notes.
2. The user can make changes to the text of the note.
3. The user can save the updated note.

### User Story #6: Delete Note
As a user, I want to delete a note so that I can remove information that is no longer needed.

#### Acceptance Criteria:
1. The user can select a note from the list of saved notes.
2. The user can click a "Delete" button to remove the note.
3. The user receives a confirmation prompt before the note is deleted.

---