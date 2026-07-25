# API Reference

## Base URL

For local backend development:

```text
http://localhost:5000
```

The server uses the `PORT` environment variable when it is set.

## Audit a Website

```text
POST /api/audit
```

Downloads one website page and returns metadata and HTML element counts.

### Headers

```http
Content-Type: application/json
```

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | Website URL to audit |

The protocol is optional. If it is omitted, the service adds `https://`.

```json
{
  "url": "https://example.com"
}
```

This input is also accepted and normalized to `https://example.com`:

```json
{
  "url": "example.com"
}
```

### Success Response

Status:

```text
200 OK
```

Content type:

```text
application/json
```

Example:

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

### Response Fields

| Field | Type | Description |
| --- | --- | --- |
| `status` | number | HTTP status returned by the audited website |
| `url` | string | Normalized URL requested by the service |
| `title` | string | Text inside the page's `title` element |
| `description` | string | Content of `meta[name="description"]`, or an empty string |
| `h1Count` | number | Number of `h1` elements |
| `h2Count` | number | Number of `h2` elements |
| `imageCount` | number | Number of `img` elements |
| `imagesWithoutAlt` | number | Number of `img` elements without an `alt` attribute |
| `linkCount` | number | Number of `a` elements |
| `internalLinks` | number | Links whose `href` starts with `/` |
| `externalLinks` | number | Links whose `href` starts with `http` |
| `canonical` | string | First canonical link URL, or an empty string |
| `language` | string | Value of the `html` element's `lang` attribute, or an empty string |

The API does not currently return response time, word count, page size, or
Lighthouse scores.

## Error Responses

All handled errors currently use the following shape:

```json
{
  "status": 404,
  "error": "Description of the problem"
}
```

### Missing URL

Request:

```json
{}
```

Current response status:

```text
404 Not Found
```

Example response:

```json
{
  "status": 404,
  "error": "URL is required"
}
```

### Invalid URL Format

Request:

```json
{
  "url": "http://"
}
```

Current response status:

```text
404 Not Found
```

Example response:

```json
{
  "status": 404,
  "error": "Invalid URL format: 'http://'"
}
```

### Target Returns 404

Current response status:

```text
404 Not Found
```

Example response:

```json
{
  "status": 404,
  "error": "Website returned 404 Not Found: https://example.com/missing"
}
```

### Website Unavailable or Request Fails

This includes DNS failures, refused connections, timeouts, and non-404
upstream errors.

Current response status:

```text
404 Not Found
```

Example response:

```json
{
  "status": 404,
  "error": "Invalid URL or website unavailable: getaddrinfo ENOTFOUND example.invalid"
}
```

## Request Behavior

- Axios follows its normal redirect behavior.
- The request timeout is 10 seconds.
- A browser-style `User-Agent` header is sent to the target website.
- Only the returned HTML is analyzed.
- Client-side JavaScript is not executed.
- Missing metadata is represented by empty strings.

## cURL Examples

Audit a full URL:

```bash
curl -X POST http://localhost:5000/api/audit \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"https://example.com\"}"
```

Audit a hostname and let the service add HTTPS:

```bash
curl -X POST http://localhost:5000/api/audit \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"example.com\"}"
```

Send invalid input:

```bash
curl -X POST http://localhost:5000/api/audit \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"http://\"}"
```
