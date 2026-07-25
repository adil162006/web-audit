# Auditly

Auditly is a small full-stack website auditing application. A user submits a
website URL, the Express API downloads the page, Cheerio analyzes its HTML, and
the React frontend displays the resulting SEO and content summary.

## Features

- Accepts URLs with or without an `http://` or `https://` prefix
- Reads the page title, meta description, canonical URL, and document language
- Counts `h1` and `h2` headings
- Counts images and images without an `alt` attribute
- Counts total, internal, and external links
- Reports the HTTP status returned by the audited website
- Returns JSON errors for invalid or unavailable websites
- Includes API integration tests with Jest and Supertest

Auditly currently analyzes one HTML page per request. It does not calculate
response time, word count, Lighthouse scores, or crawl additional pages.

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios

### Backend

- Express.js
- Axios
- Cheerio
- JavaScript ES Modules

### Testing

- Jest
- Supertest

## Project Structure

```text
.
|-- backend/
|   |-- app.js
|   |-- jest.config.js
|   |-- package.json
|   |-- src/
|   |   |-- server.js
|   |   |-- controllers/
|   |   |   `-- audit.controller.js
|   |   |-- routes/
|   |   |   `-- audit.routes.js
|   |   |-- services/
|   |   |   `-- audit.service.js
|   |   `-- utils/
|   |       `-- Asynchandler.js
|   `-- tests/
|       `-- audit.test.js
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- services/
|   |   |   `-- auditApi.js
|   |   |-- App.jsx
|   |   `-- main.jsx
|   |-- package.json
|   `-- vite.config.js
|-- api.md
|-- architecture.md
|-- package.json
`-- README.md
```

See [architecture.md](architecture.md) for the application flow and module
responsibilities. See [api.md](api.md) for the complete API contract.

## Prerequisites

- Node.js 20.18.1 or newer
- npm

## Installation

From the repository root, install the backend and frontend dependencies:

```bash
npm install --prefix backend
npm install --prefix frontend
```

## Running Locally

Start the backend:

```bash
npm start --prefix backend
```

The API listens on `http://localhost:5000` by default. Set the `PORT`
environment variable to use a different port.

In a second terminal, start the frontend:

```bash
npm run dev --prefix frontend
```

The frontend sends requests to the relative path `/api/audit`. In development
or deployment, the web server must proxy that path to the backend. The current
Vite configuration does not define that proxy, so the API can always be tested
directly with the request below.

## API Example

```bash
curl -X POST http://localhost:5000/api/audit \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"https://example.com\"}"
```

Example success response:

```json
{
  "status": 200,
  "url": "https://example.com",
  "title": "Example Domain",
  "description": "",
  "h1Count": 1,
  "h2Count": 0,
  "imageCount": 0,
  "imagesWithoutAlt": 0,
  "linkCount": 1,
  "internalLinks": 0,
  "externalLinks": 1,
  "canonical": "",
  "language": "en"
}
```

## Tests

Run the backend test suite:

```bash
npm test --prefix backend
```

Run Jest in watch mode:

```bash
npm run test:watch --prefix backend
```

The suite contains three API tests: a successful audit, an invalid URL, and an
unreachable website. It uses local HTTP servers, so it does not depend on an
external website being available.

## Build

Build the frontend from the repository root:

```bash
npm run build
```

This installs both package sets and creates the frontend production files in
`frontend/dist`. The Express backend does not currently serve that directory;
a deployment must serve the frontend separately and route `/api` requests to
the backend.

## Current Limitations

- All request errors currently return HTTP `404`, including malformed input
- URL validation accepts host-like values such as `example.com` and adds HTTPS
- Internal links are counted only when their `href` starts with `/`
- External links are counted only when their `href` starts with `http`
- JavaScript-rendered page content is not executed before analysis
- The frontend requires a same-origin API proxy

## Possible Improvements

- Return `400` for malformed request data and reserve `404` for missing pages
- Add a configurable frontend API URL or Vite development proxy
- Measure request duration and page size
- Add Lighthouse-based performance and accessibility checks
- Crawl multiple pages
- Save audit history and export reports

## AI Usage

AI was used as a development assistant for implementation guidance,
documentation, UI iteration, debugging, and code review. Final integration and
project decisions remain the responsibility of the project author.
