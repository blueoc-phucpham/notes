# Spike Document

| Repository | https://github.com/blueoc-phucpham/notes.git |
| ---------- | -------------------------------------------- |
| Author     | @blueoc-phucpham                             |
| Timebox    | 7 days                                       |

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
    - [User Story: Sign Up](#user-story-sign-up)
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
- Clarifying requirements from user stories is difficult.

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
2. Should user data be encrypted both at rest and in transit? If so, what encryption standards should we use?
3. How do we create an admin account? Are there limits on the number of admin accounts?
4. Can admin view/update/delete user's notes? Or deactivate user account?

5. Does the design support mobile (responsive) functionality across different screen sizes? If not, what changes are needed?

6. Is there a limit on how much note user can save? What should be done if one user spam very long note?

### Requirement

#### User signup

5. How much personal information is needed beyond name, email, and password? Should we include full name, avatar, and bio?

6. Can one email address be used to create multiple accounts?

7. Are there any specific password rules for security, like requiring at least one capital letter, one lowercase letter, a number, and a symbol?

#### User login

8. What happens if users forget their password?

#### Role & Permission Management

9. Access control rules is per document (like google docs) or system wide?

#### User create note

10. Can note contain images?
11. Can users share their note to other user?

#### User Edit Note

12. Note version history support?
13. Can multiple user edit the same note?

#### User Delete note

14. Is the note really deleted or should be kept in database (soft-delete)?

## Estimate

> From the developer point of view: 1 story point ~ 4h or 0.5 Dev Days

### Baseline

- [ ] Design preliminary database schema (1 point)

- [ ] Identify and list API endpoints (1 point)

- [ ] Identify and list app screens and their purposes (2 points)

- [ ] Find similar apps to get UI inspiration(0.5 point)

- [ ] Find appropriate library for implementing common task (sign up, login, role-based control) (0.5 point)


### User Story: Sign Up

- [ ] Design sign up page (1 point)

- [ ] Implement Sign Up Form UI and client-side validation (2 points)

- [ ] Write unit tests for sign-up form (1 point)

- [ ] Write API sign-up endpoint and server-side validation (1 point)

- [ ] Write unit tests for sign-up API (1 point)

- [ ] Design confirmation email (2 points)

- [ ] Implement email service to send signup confirmation email (1 point)

- [ ] Write unittest for mail sending service (1 point)



### User Story: Login

- [ ] Design login page (1 point)

- [ ] Implement Login Form UI and client-side validation (2 points)

- [ ] Write unit tests for login UI (1 point)

- [ ] Write API login endpoints and user session management (1 points)

- [ ] Write unit tests for login API (1 point)


### User Story: Create Note

- [ ] Design note list and detail page (2 points)

- [ ] Implement basic note create, update, and delete form and actions (dialogs) (3 points)

- [ ] Write API for saving note and view saved notes (2 points)

- [ ] Add note text-formatting (2 points)

- [ ] Revise database to store rich text format (1 points)

- [ ] Write unit tests for note CRUD API (1 points)

### User Story: Edit Note

- [x] Create Note Update Form (Done in previous user story)

- [ ] Write note update API (1 points)

- [ ] Write version history API (need research to store versions efficiently) (3 points)

- [ ] Write unit tests for note update and version history API (2 points)

### User Story: Delete Note

- [ ] Create Note Delete UI (Button & Confirm Dialog)

- [ ] Write unit tests for note deletion (1 point)

- [ ] Write note delete API (1 points)

- [ ] Write unit tests for note delete API (1 point)


### User Story: Role & Permission Management

- [ ] Write API for role CRUD (1 point)

- [ ] Write API for role assignment (2 points)

- [ ] Design Role Management Page (3 points)

- [ ] Implement Role Creation & Update Form (3 points)

- [ ] Implement Role Delete Confirmation Dialog (2 points)

- [ ] Implement Role Assign User Form (2 points)

- [ ] Revise note CRUD API to add role-based access control (2 points)

- [ ] Write unit tests for role & permission management API (1 points)

- [ ] Write unit tests for role & permission management UI (2 points)


## Appendix
(Include any additional information or resources here)

## Edit History

(Track changes and updates to the document here)

---