# Architecture

## Overview

Auditly uses a React frontend and an Express backend. The backend follows a
small route-controller-service structure so HTTP concerns remain separate from
the page-auditing logic.

```text
Browser
  |
  | POST /api/audit
  v
Express application
  |
  v
Audit route
  |
  v
Audit controller
  |
  v
Audit service
  |             |
  | Axios       | Cheerio
  v             v
Target site   Parsed HTML
```

## Backend Modules

### `backend/app.js`

This is the process entry point. It imports the Express application from
`src/server.js`, selects `PORT` or port `5000`, and starts listening.

Keeping `listen()` outside the Express application allows Supertest to import
the app without opening the production server port.

### `backend/src/server.js`

This file creates and configures the Express application:

- Enables CORS
- Parses JSON request bodies
- Mounts the audit router at `/api/audit`
- Converts propagated errors into JSON responses
- Exports the Express app for `app.js` and the test suite

Although the file is named `server.js`, it exports the configured Express
application and does not call `listen()`.

### `backend/src/routes/audit.routes.js`

The router registers:

```text
POST /
```

Because the router is mounted at `/api/audit`, its public path is:

```text
POST /api/audit
```

### `backend/src/controllers/audit.controller.js`

The controller reads `url` from the JSON body, rejects a missing value, calls
the service, and returns the report with HTTP `200`.

The controller is wrapped with `asyncHandler`, which forwards rejected
promises to the global Express error middleware.

### `backend/src/services/audit.service.js`

The service owns the audit workflow:

1. Checks that the input is a non-empty string.
2. Trims the input.
3. Adds `https://` when no HTTP protocol is present.
4. Validates the normalized value with the built-in `URL` constructor.
5. Downloads the page with Axios using a 10-second timeout.
6. Parses the returned HTML with Cheerio.
7. Builds and returns the audit report.

This service performs static HTML analysis. It does not run the target page's
JavaScript.

### `backend/src/utils/Asynchandler.js`

This helper wraps asynchronous route handlers and passes rejected promises to
Express with `next(error)`.

## Frontend Modules

### `frontend/src/App.jsx`

The main component owns the request, loading, error, and report states. It
adapts the flat backend response into the groups displayed by the UI.

Some UI groups, such as security and performance, are derived from existing
response fields. They are not separate API objects.

### `frontend/src/services/auditApi.js`

This module sends:

```text
POST /api/audit
```

It returns successful response data and converts Axios failures into regular
JavaScript errors with `message` and `status` properties.

Because the path is relative, the frontend expects `/api` to be available on
the same origin or forwarded to the backend by a development/deployment proxy.

### `frontend/src/components`

The components render the URL form, loading state, error message, overview,
navigation, and audit result sections.

## Request Lifecycle

1. The user submits a URL in the React form.
2. `fetchAuditData` posts `{ "url": "..." }` to `/api/audit`.
3. Express routes the request to `auditWebsite`.
4. The controller calls `performAudit`.
5. Axios requests the target website.
6. Cheerio extracts metadata and counts selected elements.
7. The controller returns the report as JSON.
8. React stores the report and renders the result sections.
9. If any step throws, the Express error middleware returns a JSON error.

## Error Flow

```text
Controller or service throws
  |
  v
asyncHandler calls next(error)
  |
  v
Global error middleware
  |
  v
JSON: { "status": 404, "error": "..." }
```

The current implementation defaults all handled failures to `404`. A future
revision could distinguish request validation (`400`), upstream not found
(`404`), timeout (`504`), and other upstream failures (`502`).

## Testing Architecture

`backend/tests/audit.test.js` imports the Express app directly and uses
Supertest to issue requests without starting `backend/app.js`.

The three tests cover:

- A successful audit against a temporary local HTML server
- A malformed URL
- A connection to a closed local port

The local servers keep the tests deterministic while still exercising the
real route, controller, service, Axios request, and Cheerio parser.

Jest is configured for ES Modules in `backend/jest.config.js`, and the npm test
script starts Jest through Node's VM modules support.

## Deployment Shape

The root build script installs both applications and builds the frontend into
`frontend/dist`. The backend does not currently serve those files.

A deployment therefore needs:

- A process running the Express backend
- Static hosting for `frontend/dist`
- A proxy or routing rule that forwards `/api/*` to Express
