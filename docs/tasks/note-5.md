## Write user sign up api & unittest

### Description

User sign up api. Username and email should be unique. Password should be hashed in db.

### Objectives

- Restful API spec should be followed.
- Happy case as well as invalid and exception case must be handled
- Test coverage at least 80%
- Security standard must be considered in store the password.

### Dependencies

- [Design database](./note-1.md)
- [Set up project](./note-2.md)

### Acceptance Criteria

- User should receive error if username already exists, email already exists...
- Password must be complicated enough, according to req.
- Password hashing algorighm should take considerable amount of time to compute (prevent rainbow table attack)
- User should be deactivate until email is verified.

### Estimated Effort

- **Story Point:** 2 points
- **Time:** 4 hours

### Additional Notes

None

### [Back to index.md](../index.md#task-list)

---

