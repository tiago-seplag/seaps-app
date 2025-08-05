/* eslint-disable @typescript-eslint/no-explicit-any */
import orchestrator from "@/tests/orchestrator";
import { version as uuidVersion } from "uuid";

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
});

describe("POST /api/v1/models", () => {
  test("should return 201 and a created model with valid session", async () => {
    const response = await fetch("http://localhost:3000/api/v1/models", {
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

    const responseBody = await response.json();

    expect(response.status).toBe(201);

    expect(responseBody).toEqual({
      id: responseBody.id,
      name: responseBody.name,
      description: responseBody.description,
      is_deleted: false,
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
    });
    expect(uuidVersion(responseBody.id)).toEqual(4);

    expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
  });

  test("should return 401 if session is missing", async () => {
    const response = await fetch("http://localhost:3000/api/v1/models", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test Model",
        description: "This is a test model",
        items: [{ name: "Test Item 1" }],
      }),
    });

    expect(response.status).toBe(401);
  });

  test("should return 400 if required fields are missing", async () => {
    const response = await fetch("http://localhost:3000/api/v1/models", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${session.token}`,
      },
      body: JSON.stringify({
        description: "Missing name field",
        items: [{ name: "Test Item" }],
      }),
    });

    expect(response.status).toBe(400);
    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      message: "Um erro de validação ocorreu.",
      messages: ["Insira o nome do Modelo"],
      action: "Por favor, corrija os campos informados.",
      status_code: 400,
    });

    expect(responseBody).toHaveProperty("messages");
  });

  test("should return 400 if items is not an array", async () => {
    const response = await fetch("http://localhost:3000/api/v1/models", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${session.token}`,
      },
      body: JSON.stringify({
        name: "Test Model",
        description: "Items is not an array",
        items: "not-an-array",
      }),
    });

    expect(response.status).toBe(400);
    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      message: "Um erro de validação ocorreu.",
      messages: ["Insira uma lista de Itens"],
      action: "Por favor, corrija os campos informados.",
      status_code: 400,
    });

    expect(responseBody).toHaveProperty("messages");
  });

  test("should return 400 if model already created and active", async () => {
    const response = await fetch("http://localhost:3000/api/v1/models", {
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

    expect(response.status).toBe(400);

    const responseBody = await response.json();

    expect(responseBody).toEqual({
      name: "ValidationError",
      action: "Escolha um nome diferente para o modelo.",
      message: "Esse Modelo já existe.",
      status_code: 400,
    });
  });

  test("should return 401 if session is invalid", async () => {
    const response = await fetch("http://localhost:3000/api/v1/models", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=invalidtoken`,
      },
      body: JSON.stringify({
        name: "Test Model",
        description: "Invalid session",
        items: [{ name: "Test Item" }],
      }),
    });

    expect([401, 403]).toContain(response.status);
  });
});
