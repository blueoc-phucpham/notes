## User Stories

### User Story #1: User Login
As a user, I want to log into my account so that I can access my personal data.

#### Acceptance Criteria:
1. The user can navigate to the login page.
2. The user can enter their username and password.
3. The user can click a "Login" button to authenticate.
4. The user receives an error message if the login fails.
5. The user is redirected to their dashboard upon successful login.

#### Addtional notes

### User Story #2: User Signup
As a new user, I want to create an account so that I can start using the application.

#### Acceptance Criteria:
1. The user can navigate to the signup page.
2. The user can enter their personal information (e.g., name, email, password).
3. The user can click a "Sign Up" button to create their account.
4. The user receives a confirmation email after signing up.
5. The user can click a link in the confirmation email to verify their account.

#### Addtional notes
1. The user can only create one account per email.
2. The user must create password at least 8 characters with letters (both uppercase and lowercase), numbers, and symbols, and includes no obvious personal information (like username and email)

### User Story #3: Role & Permission Management
As an administrator, I want to manage user roles and permissions so that I can control access to different features and data within the application.

#### Acceptance Criteria:
1. The administrator can navigate to the role management page.
2. The administrator can create new roles with specific permissions (create & update / delete / view).
3. The administrator can assign roles to users.
4. The administrator can modify permissions for existing roles.
5. The administrator can delete roles that are no longer needed.
6. Users can access features and data based on their assigned roles and permissions.

#### Addtional notes
1. Only one administrator is created
2. Permission control is per-note
3. Each user can only edit their notes unless given role with permission from admin
4. All note is visible by default.
5. No real-time multiple user editing is considered.

### User Story #4: Create Note
As a user, I want to create a new note so that I can capture and organize my thoughts and information.

#### Acceptance Criteria:
1. The user can click a "New Note" button to create a new note.
2. The user can enter and format text within the note.
3. The user can save the note for future reference.
4. The user can view a list of all saved notes.

#### Addtional notes
1. Note is visible to every one by default

### User Story #5: Edit Note
As a user, I want to edit an existing note so that I can update or correct information.

#### Acceptance Criteria:
1. The user can select a note from the list of saved notes.
2. The user can make changes to the text of the note.
3. The user can save the updated note.

#### Addtional notes
1. Note'author can edit the note by default
2. No realtime multiple editing
3. User with edit role receive from admin can edit note.


### User Story #6: Delete Note
As a user, I want to delete a note so that I can remove information that is no longer needed.

#### Acceptance Criteria:
1. The user can select a note from the list of saved notes.
2. The user can click a "Delete" button to remove the note.
3. The user receives a confirmation prompt before the note is deleted.

#### Addtional notes
1. This system is soft-delete only.

