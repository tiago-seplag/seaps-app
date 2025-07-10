/* eslint-disable @typescript-eslint/no-explicit-any */
import { version as uuidVersion } from "uuid";
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

describe("GET /api/v1/checklists/[id]", () => {
  test("should return 200 and a checklist with valid session", async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/checklists/` + checklist.id,
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

    expect(responseBody).toEqual({
      id: checklist.id,
      sid: "0001/25",
      organization_id: organizations[0].id,
      model_id: model.id,
      property_id: property.id,
      user_id: user.id,
      finished_by: null,
      score: null,
      classification: null,
      status: "OPEN",
      is_deleted: false,
      finished_at: null,
      created_at: checklist.created_at.toISOString(),
      updated_at: checklist.updated_at.toISOString(),
      organization: {
        id: organizations[0].id,
        acronym: organizations[0].acronym,
        name: organizations[0].name,
      },
      property: {
        id: property.id,
        organization_id: property.organization_id,
        person_id: property.person_id,
        name: property.name,
        address: property.address,
        type: property.type,
        created_at: property.created_at.toISOString(),
        updated_at: property.updated_at.toISOString(),
        person: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          email: expect.any(String),
          phone: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }),
      },
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
    expect(uuidVersion(responseBody.id)).toEqual(4);

    expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
  });

  test("should return 404 if checklist does not exist", async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/checklists/` + uuidv4(),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session=${session.token}`,
        },
      },
    );

    expect(response.status).toBe(404);
  });

  test("should return 401 if no session cookie is provided", async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/checklists/${checklist.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    expect(response.status).toBe(401);
  });

  test("should return 400 for invalid checklist ID format", async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/checklists/invalid-id`,
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
});
