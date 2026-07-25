import http from "node:http";
import request from "supertest";
import app from "../src/server.js";

let auditTarget;
let auditTargetUrl;

const listen = (server) =>
  new Promise((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });

const close = (server) =>
  new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

beforeAll(async () => {
  auditTarget = http.createServer((_req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <!doctype html>
      <html lang="en">
        <head>
          <title>Audit Test Page</title>
          <meta name="description" content="A page used by the audit tests">
          <link rel="canonical" href="${auditTargetUrl}">
        </head>
        <body>
          <h1>Main heading</h1>
          <h2>Second heading</h2>
          <img src="/with-alt.png" alt="Example">
          <img src="/without-alt.png">
          <a href="/about">About</a>
          <a href="https://example.com">External link</a>
        </body>
      </html>
    `);
  });

  await listen(auditTarget);
  const { port } = auditTarget.address();
  auditTargetUrl = `http://127.0.0.1:${port}`;
});

afterAll(async () => {
  await close(auditTarget);
});

describe("POST /api/audit", () => {
  test("returns an audit report for a valid URL", async () => {
    const response = await request(app)
      .post("/api/audit")
      .send({ url: auditTargetUrl });

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: 200,
        url: auditTargetUrl,
        title: "Audit Test Page",
        description: "A page used by the audit tests",
        h1Count: 1,
        h2Count: 1,
        imageCount: 2,
        imagesWithoutAlt: 1,
        linkCount: 2,
        internalLinks: 1,
        externalLinks: 1,
        canonical: auditTargetUrl,
        language: "en",
      })
    );
  });

  test("returns an error for an invalid URL", async () => {
    const response = await request(app)
      .post("/api/audit")
      .send({ url: "http://" });

    expect(response.status).toBe(404);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.error).toEqual(expect.any(String));
    expect(response.body.error.length).toBeGreaterThan(0);
  });

  test("returns an error when the website is unreachable", async () => {
    const unavailableServer = http.createServer();
    await listen(unavailableServer);
    const { port } = unavailableServer.address();
    await close(unavailableServer);

    const response = await request(app)
      .post("/api/audit")
      .send({ url: `http://127.0.0.1:${port}` });

    expect(response.status).toBe(404);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.error).toEqual(expect.any(String));
    expect(response.body.error.length).toBeGreaterThan(0);
  });
});
