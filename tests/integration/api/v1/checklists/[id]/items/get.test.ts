/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";

import orchestrator from "@/tests/orchestrator";

let user: any;
let session: any;
let checklist: any;
let organizations: any;
let property: any;
let model: any;

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runMigrations();
  organizations = await orchestrator.createOrganizations();
  property = await orchestrator.createProperty(organizations[0].id);

  model = await orchestrator.createModel();

  user = await orchestrator.createUser({
    email: "user@email.com",
    password: "correct-password",
  });

  session = await orchestrator.createSession(user.id);

  checklist = await orchestrator.createChecklist({
    organization_id: organizations[0].id,
    property_id: property.id,
    model_id: model.id,
    user_id: user.id,
  });
});

describe("GET /api/v1/checklists/[id]/items", () => {
  test("should return 200 and a checklist with valid session", async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/checklists/` + checklist.id + "/items",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session=${session.token}`,
        },
      },
    );

    const responseBody = await response.json();
    expect(response.status).toBe(200);

    expect(responseBody).toHaveLength(10);
  });

  test("should return 404 if checklist does not exist", async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/checklists/` + uuidv4() + `/items`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session=${session.token}`,
        },
      },
    );

    const responseBody = await response.json();
    expect(response.status).toBe(404);

    expect(responseBody).toEqual({
      message: "Esse ID de checklist não existe",
      action: "Verifique se o ID foi passado corretamente",
      name: "NotFoundError",
      status_code: 404,
    });
  });
});
