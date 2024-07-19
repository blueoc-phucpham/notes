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
    - [Task list](#task-list)
      - [Backend](#backend)
      - [Frontend](#frontend)
  - [Appendix](#appendix)
  - [Edit History](#edit-history)

## Context

The developer needs to make a plan and estimate tasks to create a note-taking app with basic user authentication and role-based access control (details in the [requirement.md](./requirement.md#user-stories)).

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
<details>
<summary>Details</summary>
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

</details>

## Estimate

### Task list

Total time: 125 hours
Total story points: 66

#### Backend

**Time**: 57 hours

**Story point**: 29 point

1. [Design database](./tasks/note-1.md)
2. [Set up project](./tasks/note-2.md)
3. [Write note CRUD api & unittest](./tasks/note-3.md)
4. [Write note edit version history api & unittest](./tasks/note-4.md)
5. [Write user sign up api & unittest](./tasks/note-5.md)
6. [Write user login and logout api](./tasks/note-6.md)
7. [Write user search by username and email api & unittest](./tasks/note-7.md)
8. [Config send email service](./tasks/note-8.md)
9. [Write email account verification api & unittest](./tasks/note-9.md)
10. [Config admin account creation](./tasks/note-10.md)
11. [admin] [write role CRUD API](./tasks/note-11.md)
12. [admin] [write role assign/unassign api](./tasks/note-12.md)
13. [Config user authorization](./tasks/note-13.md)

#### Frontend

**Time**: 68 hours

**Story point**: 37 points

14. [Draw basic mock up](./tasks/note-14.md)
15. [Set up project](./tasks/note-15.md)
16. [Config page routing & responsive design](./tasks/note-16.md)
17. [login & sign up page](./tasks/note-17.md)
18. [dashboard(note list) page](./tasks/note-18.md)
19. [detail note page](./tasks/note-19.md)
20. [edit history dialog](./tasks/note-20.md)
21. [note update/delete dialog](./tasks/note-21.md)
22. [\[admin\] user role list page](./tasks/note-22.md)
23. [\[admin\] role assign dialog](./tasks/note-23.md)
24. [\[admin\] user role update/delete dialog](./tasks/note-24.md)


## Appendix
(Include any additional information or resources here)

## Edit History
> Major versions are tagged by git.

| Version       | Tag    |
| ------------- | ------ |
| First version | v0.1.0 |
|               |        |

---