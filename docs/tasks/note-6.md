## Write user login

### Description

user login to manage user session. JWT authentication will be used

### Objectives

- Restful API spec should be followed.
- Happy case as well as invalid and exception case must be handled
- Test coverage at least 80%
- JWT token invalidation must be handled. Token expiration and subject must follow security standard.

### Dependencies

- [Design database](./note-1.md)
- [Set up project](./note-2.md)

### Acceptance Criteria

- Only email verified user can login successfully.
- api should return access token and refresh token to authorized sub-sequence request.
- token must expire after a configable amount of time.


### Estimated Effort

- **Story Point:** 2 points
- **Time:** 4 hours

### Additional Notes

None

### [Back to index.md](../index.md#task-list)

---

