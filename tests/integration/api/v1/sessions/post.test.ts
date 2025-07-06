import { version as uuidVersion } from "uuid";
import { EXPIRATION_IN_MILLISECONDS } from "@/models/session";
import orchestrator from "@/tests/orchestrator";

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runMigrations();
});

describe("POST /api/v1/sessions", () => {
  test("With incorrect `email` and incorrect `password`", async () => {
    const response = await fetch("http://localhost:3000/api/v1/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "email.incorrect@email.com",
        password: "wrong-password",
      }),
    });

    expect(response.status).toBe(401);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      message: "Dados de autenticação não conferem.",
      action: "Verifique se os dados enviados estão corretos.",
      name: "UnauthorizedError",
      status_code: 401,
    });
  });

  test("With correct `email` and correct `password`", async () => {
    const createdUser = await orchestrator.createUser({
      email: "correto@email.com",
      password: "senha-correta",
    });

    const response = await fetch("http://localhost:3000/api/v1/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "correto@email.com",
        password: "senha-correta",
      }),
    });

    expect(response.status).toBe(201);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      id: responseBody.id,
      user_id: createdUser.id,
      token: responseBody.token,
      user_agent: "node",
      type: "password",
      is_active: true,
      expires_at: responseBody.expires_at,
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });
    expect(uuidVersion(responseBody.id)).toEqual(4);
    expect(Date.parse(responseBody.expires_at)).not.toBeNaN();
    expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

    const expiresAt = new Date(responseBody.expires_at);
    const createdAt = new Date(responseBody.created_at);

    expiresAt.setMilliseconds(0);
    createdAt.setMilliseconds(0);

    expect(expiresAt.getTime() - createdAt.getTime()).toBe(
      EXPIRATION_IN_MILLISECONDS,
    );

    const setCookie = response.headers.get("set-cookie");

    expect(setCookie).toMatch(/session=/)
    expect(setCookie).toMatch(responseBody.token)
  });
});
