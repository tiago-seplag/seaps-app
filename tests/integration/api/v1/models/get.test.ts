/* eslint-disable @typescript-eslint/no-explicit-any */
import orchestrator from "@/tests/orchestrator";

let user: any;
let session: any;

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runMigrations();

  user = await orchestrator.createUser({
    email: "user@email.com",
    password: "correct-password",
  });

  session = await orchestrator.createSession(user.id);

  await fetch("http://localhost:3000/api/v1/models", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `session=${session.token}`,
    },
    body: JSON.stringify({
      name: "Test Model",
      description: "This is a test model",
      items: [{ name: "Test Item 1" }, { name: "Test Item 2" }],
    }),
  });

  await fetch("http://localhost:3000/api/v1/models", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `session=${session.token}`,
    },
    body: JSON.stringify({
      name: "Test Model 2",
      description: "This is a test model",
      items: [{ name: "Test Item 1" }, { name: "Test Item 2" }],
    }),
  });
});

describe("GET /api/v1/models", () => {
  test("should return 200 and a list of models with valid session", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/models?page=1&per_page=1",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session=${session.token}`,
        },
      },
    );

    expect(response.status).toBe(200);

    const responseBody = await response.json();

    expect(Array.isArray(responseBody.data)).toBe(true);
    expect(responseBody.data.length).toBeLessThanOrEqual(1);
    expect(responseBody).toHaveProperty("meta");
  });

  test("should return 401 if session is missing", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/models?page=1&per_page=1",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    expect(response.status).toBe(401);
  });

  test("should return 400 for invalid pagination parameters", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/models?page=abc&per_page=-1",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session=${session.token}`,
        },
      },
    );

    expect(response.status).toBe(400);
  });

  test("should return 200 and empty data if page is out of range", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/models?page=9999&per_page=1",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session=${session.token}`,
        },
      },
    );

    expect(response.status).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody.data)).toBe(true);
    expect(responseBody.data.length).toBe(0);
  });
});
