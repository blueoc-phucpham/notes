# Spike Document

| Repository | https://github.com/blueoc-phucpham/notes.git |
| ---------- | -------------------------------------------- |
| Author     | @blueoc-phucpham                             |
| Timebox    | 7 days                                       |
| Start date | 17/07/2024                                   |

- [Spike Document](#spike-document)
  - [Context](#context)
  - [Goal](#goal)
  - [Discovery](#discovery)
  - [Unresolved Questions](#unresolved-questions)
    - [Common](#common)
    - [Requirement](#requirement)
      - [User signup](#user-signup)
      - [User login](#user-login)
      - [Role \& Permission Management](#role--permission-management)
      - [User create note](#user-create-note)
      - [User Edit Note](#user-edit-note)
      - [User Delete note](#user-delete-note)
  - [Estimate](#estimate)
    - [Baseline](#baseline)
    - [User Signup](#user-signup-1)
    - [User Story: Login](#user-story-login)
    - [User Story: Create Note](#user-story-create-note)
    - [User Story: Edit Note](#user-story-edit-note)
    - [User Story: Delete Note](#user-story-delete-note)
    - [User Story: Role \& Permission Management](#user-story-role--permission-management)
  - [Appendix](#appendix)
  - [Edit History](#edit-history)

## Context

The developer needs to make a plan and estimate tasks to create a note-taking app with basic user authentication and role-based access control (details in the [README](../README.md#user-stories)).

**Knowledge Gap**:

- The developer has never written frontend unit tests before.
- Clarifying requirements from user stories is challenging.
- Try to break tasks from user stories make tasks not strongly attached.
    > For example to implement sign up, I have to design the web page, write some frontend code, than write backend code, then testing. Context-switching between various type of task might be inefficient

**Skill Gap**:

- The developer is not familiar with UI Design.
- The developer has never written an API with Django.
- The developer frontend related skill is really limited

## Goal

- The app satisfies the user story's acceptance criteria.
- Task estimation is correct, give or take 10%.
- The resulting document is comprehensive, enabling any developer to quickly understand the system and contribute to the project.

## Discovery

(To be filled in during the spike)

## Unresolved Questions

### Common

1. What metrics or criteria should we use to evaluate our test suite's effectiveness?

> The test should cover both happy case, invalid input data and unexpected exception.
> The coverage should be at least 80%

2. Should all user data be encrypted in the database?

> Encrypt password

3. How do we create an admin account? Are there limits on the number of admin accounts?

> Only one admin on system initialized.

4. Can admin view/update/delete user's notes? Or deactivate user account? Can admin view all user's infomation?

> Admin can do anything in system.

5. Does the design support mobile (responsive) functionality across different screen sizes?

> Should be considered

6. Is there a limit on how much note user can save? What should be done if one user spam very long note?

> 10 notes per user

7. Is note searching and categorizing is needed?

> No

### Requirement

#### User signup

7. How much personal information is needed beyond name, email, and password? Should we include full name, avatar, and bio?

> Only name, email and password

8. Can one email address be used to create multiple accounts?

> No

9. Are there any specific password rules for security, like requiring at least one capital letter, one lowercase letter, a number, and a symbol?

> at least 8 characters with letters (both uppercase and lowercase), numbers, and symbols, and includes no obvious personal information 

#### User login

10. What happens if users forget their password?

> Not on scope

#### Role & Permission Management

11. Access control rules is per document (like google docs) or system wide?

> Per document

12. Can one user view/update/delete other user's note if given edit role?

> Yes

#### User create note

13. Can users share their note to other user?

> Note visible by everyone by default.

#### User Edit Note

14. Note edit history support?

> Yes

15. Can multiple user edit the same note?

> Yes, but not in the same time

#### User Delete note

16. Is the note really deleted or should be kept in database (soft-delete)?

> Soft-delete

## Estimate

### Baseline

- [ ] **Design preliminary database schema**
  - **Description:** Develop the basic structure database schemas to following user stories. The schemas may be revised or update as the requirement clarified further.
  - **Estimation:** 4 hours
  - **Output**: An Entity Relationship Diagram, A relational diagram and a Postgres DDL script


- [ ] Identify and list API endpoints
  - **Description:** Design the restful api spec. The spec must indicate the route, method, query param, request body, response body if needed.
  - **Estimation:** 2 hours
  - **Output**: A OpenAPI spec listing every api route in the app

- [ ] Research appropriate library for implementing common task (sign up, login, role-based control)
  - **Description:** Research common library and best practice in handling common task and feature using django and react. Like login, signup, role-based access control
  - **Estimation:** 2 hours
  - **Output**: A comparision document of libraries pros and cons and developer's recommended choice

- [ ] Note taking app design on Figma Community Website
  - **Description:** Find a available design on figma or dripble, or get some idea from popular note taking app 
  - **Estimation:** 4 hours
  - **Output**: A figma design document with required screens to build app UI


### User Signup

1. **Frontend**
    - [ ] **Create Signup Page Component**
        - **Description:** Develop the basic structure of the signup page, including form fields for username, email and password.
        - **Estimation:** 4 hours
        - **Output:** A signup page styled exactly like design.

    - [ ] **Form Validation with Formik**
        - **Description:** Integrate Formik for form state management and validation.
        - **Estimation:** 4 hours
        - **Output:** A working sign up page with complete validation errors and form error(like wrong user or password)

    - [ ] **Routing with react-router-dom**
        - **Description:** Ensure navigation to the signup page and redirect to the login page or other appropriate page after successful signup.
        - **Estimation:** 2 hours

2. **Backend**
   - [ ] **Create Search User API Endpoint**
        - **Description:** Develop the search user API endpoint in Django to support user signup workflow. User may search user by username or email.
        - **Estimation:** 2 hours
        - **Output:** A API route to search user by username or email.
    - [ ] **Create Signup API Endpoint**
        - **Description:** Develop the signup API endpoint in Django to handle new user registrations.
        - **Estimation:** 2 hours
        - **Output:** A API route to sign up, user infomation should be stored in the database, password should be hashed.
    - [ ] **Send Confirmation Email**
        - **Description:** Implement functionality to send a confirmation email upon successful signup.
        - **Estimation:** 3 hours
        - **Output:** Working email service, a email template for both html and text mail client.

    - [ ] **Create Email Verification Endpoint**
        - **Description:** Develop an endpoint to handle email verification when the user clicks the confirmation link.
        - **Estimation:** 2 hours
        - **Output:** When user click the confirmation link in email, it should active their account and redirect to login page.

3. **Integration**
    - [ ] **Frontend and Backend Integration**
        - **Description:** Integrate the frontend signup form with the backend API.
        - **Estimation:** 2 hours
        - **Output:** Frontend should be able to call backend sign up API without any issues. API error response should also be handled 
    - [ ] **Write Tests**
        - **Description:** Write unit for the signup functionality.
        - **Estimation:** 4 hours
        - **Output:** A test suite in both frontend and backend with 80% coverage

### User Story: Login

1. **Frontend**
    - [ ] **Create Login Page Component**
        - **Description:** Develop the basic structure of the login page including form fields for username and password.
        - **Estimation:** 4 hours
    - [ ] **Form Validation with Formik**
        - **Description:** Integrate Formik for form state management and validation including when login fail.
        - **Estimation:** 2 hours


    - [ ] **Routing with react-router-dom**
        - **Description:** Ensure navigation to the login page and redirect to the dashboard on successful login. Should be adapt from similar task in sign up.
        - **Estimation:** 0.5 hours

2. **Backend**
    - **Create Login API Endpoint**
        - **Description:** Develop the login API endpoint in Django to handle authentication.
        - **Estimation:** 2 hours

3. **Integration**
    - [ ] **Frontend and Backend Integration**
        - **Description:** Integrate the frontend login form with the backend API.
        - **Estimation:** 2 hours
    - [ ] **Write Tests**
        - **Description:** Write unit for the login functionality.
        - **Estimation:** 4 hours
        - **Output:** A test suite in both frontend and backend with 80% coverage

### User Story: Create Note

1. Frontend

   - [ ] **Implement Note list (User Dashboard) Page**
       - **Description:** Implement Note listing page. User can only see their saved note(not other users). Unauthenticated user will be redirect to login. 
       - **Estimation:** 4 hours
       - **Output:** A User Dashboard listing user note.

   - [ ] **Implement Note Detail Page**
       - **Description:** Implement Note Detail page. User should be able to go to this page from dashboard. Unauthenticated user will be redirect to login. Unauthorized user will see a 404 page
       - **Estimation:** 4 hours
       - **Output:** A User Dashboard Detail user note.

   - [ ] **Implement Create Note Dialog**
       - **Description:** Implement Create Note Dialog. Dialog can be opened from note details and note list page. Additional keyboard short-cut for power user should be considered.
       - **Estimation:** 4 hours
       - **Output:** A functional create note dialog modal. User should be redirect to note detail after create note.

   - [ ] **Add Note Text-Formatting UI**
       - **Description:** Update note dialog to include a rich text editor with basic formating (bold, italic, underline)
       - **Estimation:** 4 hours
       - **Output:** A note create dialog with basic text formating support

2. Backend

   - [ ] **Write API for Saving Notes, Viewing Saved Notes and Note List**
       - **Description:** Implement note create, note list and note detail API. Some error handling like blank title note, note not found should be consisdered. API should be able to store richtext format.
       - **Estimation:** 6 hours
       - **Output:** Note creation and node detail API

3. Intergration

   - [ ] **Intergrate UI with backend API**
       - **Description:** Intergate Frontend UI and Backend API for create note story.
       - **Estimation:** 4 hours
       - **Output:** Functional create, view and list note pages

   - [ ] **Write Unit Tests**
       - **Description:** Write unitest for note CRUD API and UI
       - **Estimation:** 4 hours
       - **Output:** Test suite with 80% coverage


### User Story: Edit Note

1. Frontend: 

   - [ ] **Add Note Update Dialog**
       - **Description:** Implement Update Note Dialog. Dialog can be opened from note details and note list page. Additional keyboard short-cut for power user should be considered. This dialog should be adapt from Note Create Dialog
       - **Estimation:** 2 hours
       - **Output:** Note Update Dialog

2. Backend

    - [ ] **Write API for Update Note**
         - **Description:** Implement note update API
         - **Estimation:** 1 hours
         - **Output:** Note update API

3. Intergration

    - [ ] **Intergrate UI with backend API**
       - **Description:** Intergate Frontend UI and Backend API
       - **Estimation:** 4 hours
       - **Output:** Functional create, view and list note pages

   - [ ] **Write Unit Tests**
       - **Description:** Write unitest for note CRUD API and UI
       - **Estimation:** 4 hours
       - **Output:** Test suite with 80% coverage

### User Story: Delete Note

1. Front end
   - [ ] **Add Note Delete Confirmation Dialog**

      - **Description:** Implement Delete Note Dialog. Dialog can be opened from note details and note list page.
      - **Estimation:** 2 hours
      - **Output:** Note Delete Dialog

2. Backend
    - [ ] **Write API for Delete Note**
        - **Description:** Implement note delete API. Only user with delete permission can delete note.
        - **Estimation:** 1 hours
        - **Output:** Note delete API

3. **Intergation**
    - [ ] **Intergrate UI with backend API**
       - **Description:** Intergate Frontend UI and Backend API for delete note
       - **Estimation:** 2 hours
       - **Output:** Functional create, view and list note pages

   - [ ] **Write Unit Tests**
       - **Description:** Write unitest for note CRUD API and UI
       - **Estimation:** 4 hours
       - **Output:** Test suite with 80% coverage

### User Story: Role & Permission Management

> Only admin can access following pages and apis.

1. Frontend
    - [ ] **Implement Role List Page**
      - **Description:** Write a page to view existing role in system. Only admin can access this page. Each role permission should be visible.
      - **Estimation:** 4 hours
      - **Output:** Role listing page, role should be sorted by created time. Admin should see a navigation link from dashboard to this page.

    - [ ] **Role Create & Update Dialog**
       -  **Description:** Create and Update Dialog can be open from Role listing page. Admin will be able to update permission for existing role or create a new one with permissions(read/write/delete)
       -  **Estimation:** 6 hours
       -  **Output:** Create & Update Dialog for role.
    
    - [ ] **Role Deletion Dialog**
      -  **Description:** Role confirmation dialog. If a role is deleted, all users have that role also lost permissions given by that role.
       -  **Estimation:** 2 hours

    - [ ] **Role assign dialog**
      - [ ] **Description:** From Role management page, admin can open role assign dialog. They will be able to pick an user with the first input, then choosen user role will be loaded in the second multi-select. Admin then can update that user roles and save.
      - [ ] **Estimation:** 4 hours

2. Backend
    - [ ] **Write CRUD Role API**
      - **Description**: Write CRUD API for Role to able admin create, update or delete role permissions. Admin should be able to create new role with permission (view/update/delete) or update existing role permissions. Only admin can access this api, normal user will see a 403 status code
      - **Estimation**: 4 hours

    - [ ] **Write Role assign APIs**
      - **Description:** Write user role assign API. Add username search API to support admin choose user in assign dialog. Already done in user sign up story.
    
    - [ ] **Ensure access control in Note CRUD API**
      - **Description:** Review and update note CRUD API to align with user's role. Update UI to hide update/delete button based on user permissions.
      - **Estimate:** 4 hours


3. Intergate

    - [ ] **Intergrate UI with backend API**
       - **Description:** Intergate Frontend UI and Backend API
       - **Estimation:** 4 hours
       - **Output:** Functional create, view and list note pages

   - [ ] **Write Unit Tests**
       - **Description:** Write unitest for note CRUD API and UI
       - **Estimation:** 4 hours
       - **Output:** Test suite with 80% coverage

## Appendix
(Include any additional information or resources here)

## Edit History
> Major versions are tagged by git.

| Version       | Tag    |
|---------------|--------|
| First version | v0.1.0 |
|               |        |

---