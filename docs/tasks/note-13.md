## Config user authorization

### Description

Only user with privileged can access system data (notes). Task must be taken to prohibit unauthorized user doing what they not suppose to do 

### Objectives

- Admin can do anything
- Only user can edit/delete their note by default
- Every one can view any note
- User with edit/delete role from admin can edit/delete can edit/delete given note.

### Dependencies

- [Design database](./note-1.md)
- [Set up project](./note-2.md)

### Acceptance Criteria

- Almost all api should be authorized (except sign up and email verification and user search)
- Only admin can use [admin] api


### Estimated Effort

- **Story Point:** 1 points
- **Time:** 3 hours

### Additional Notes

None

### [Back to index.md](../index.md#task-list)

---

