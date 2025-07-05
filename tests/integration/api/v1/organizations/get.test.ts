/* eslint-disable @typescript-eslint/no-explicit-any */
import orchestrator from "@/tests/orchestrator";

let user: any;
let session: any;

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runMigrations();
  await orchestrator.createOrganizations();

  user = await orchestrator.createUser({
    email: "user@email.com",
    password: "correct-password",
  });

  session = await orchestrator.createSession(user.id);
});

describe("POST /api/v1/sessions", () => {
  it("should return 200 and a list of organizations with valid session", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/organizations?page=1&per_page=1",
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

  it("should return 401 if session is missing", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/organizations?page=1&per_page=1",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    expect(response.status).toBe(401);
  });

  it("should return 400 for invalid pagination parameters", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/organizations?page=abc&per_page=-1",
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

  it("should return 200 and empt y data if page is out of range", async () => {
    const response = await fetch(
      "http://localhost:3000/api/v1/organizations?page=9999&per_page=1",
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
