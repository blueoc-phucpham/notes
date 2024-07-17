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

(List any questions that need to be answered before the spike can be considered complete)

## Estimate

> From the developer point of view: 1 story point ~ 4h or 0.5 Dev Days

### Baseline

- [ ] Design preliminary database schema (1 point)
- [ ] Identify and list API endpoints (1 point)

- [ ] Identify and list app screens and their purposes (2 points)

### User Story: Sign Up

- [ ] Design sign up page (1 point)

- [ ] Implement Sign Up Form UI and client-side validation (2 points)

- [ ] Revise database schema, clarify how to store and salt password (1 points)

- [ ] Write API sign-up endpoint and server-side validation (1 point)

- [ ] Design confirmation email (2 points)

- [ ] Implement email service to send signup confirmation email (1 point)

- [ ] Write unit tests for sign-up API (1 point)

### User Story: Login

- [ ] Design login page (1 point)

- [ ] Implement Login Form UI and client-side validation (3 points)

- [ ] Write API login endpoints and user session management (1 points)

- [ ] Write unit tests for login API (1 points)

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

- [ ] Create Note Update Form (Done in previous user story)

- [ ] Write note delete API (3 points)

- [ ] Write unit tests for note delete API (2 points)

- [ ] Perform user acceptance testing for note deletion (2 points)

### User Story: Role & Permission Management

- [ ] Write API for role CRUD, role assignment (5 points)

- [ ] Design Role Management Page (3 points)

- [ ] Implement Role Creation & Update Form (5 points)

- [ ] Implement Role Delete Confirmation Dialog (3 points)

- [ ] Implement Role Assign User Form (3 points)

- [ ] Revise note CRUD API to add role-based access control (5 points)

- [ ] Write unit tests for role & permission management (3 points)


## Appendix
(Include any additional information or resources here)

## Edit History

(Track changes and updates to the document here)

---
