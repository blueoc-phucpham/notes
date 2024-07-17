## Identify and list API endpoints
*Task ID:* YAN-2

### Description

Task to create a list of API endpoints based on requirement

### Objectives
- API endpoint list should be clear and simple
- API endpoint should follow RESTful API spec

### Dependencies
None


### Acceptance Criteria
- **Criterion 1:** Each API spec should include route, method, query params, path variable, request body, response case.
For example:

GET /api/v1/notes

request:

```json
{
    title: str,
    content: str
}
```

response 200 OK

```json
{
    title: str,
    content: str,
    created_at: datetime,
    updated_at: datetime,
    version: int,
    author: {
        id: int,
        username: str
    }
}
```

- The API spec should be written in openapi spec in stored under: `docs/api`.


### Estimated Effort
*Estimate:* 1 point

### Additional Notes

The spec may be updated in the future if requirement is clarify futher.

---

