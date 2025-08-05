/* eslint-disable @typescript-eslint/no-explicit-any */
import orchestrator from "@/tests/orchestrator";
import { version as uuidVersion } from "uuid";

let user: any;
let session: any;
let model: any;
let property: any;
let organization: any;

beforeAll(async () => {
  await orchestrator.clearDatabase();
  await orchestrator.runMigrations();
  const organizations = await orchestrator.createOrganizations();

  organization = organizations[0];

  user = await orchestrator.createUser({
    email: "user@email.com",
    password: "correct-password",
  });

  session = await orchestrator.createSession(user.id);
  model = await orchestrator.createModel();
  property = await orchestrator.createProperty(organization.id);
});

describe("POST /api/v1/models", () => {
  test("should return 201 and a created checklist with valid session", async () => {
    const response = await fetch("http://localhost:3000/api/v1/checklists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${session.token}`,
      },
      body: JSON.stringify({
        model_id: model.id,
        organization_id: organization.id,
        property_id: property.id,
        user_id: user.id,
      }),
    });

    const responseBody = await response.json();

    expect(response.status).toBe(201);

    expect(responseBody).toEqual({
      id: responseBody.id,
      sid: expect.stringMatching(/^\d{4}\/\d{2}$/),
      model_id: model.id,
      organization_id: organization.id,
      property_id: property.id,
      user_id: user.id,
      finished_by: null,
      classification: null,
      score: null,
      status: "OPEN",
      is_deleted: false,
      finished_at: null,
      created_at: responseBody.created_at,
      updated_at: responseBody.updated_at,
      items: expect.arrayOf(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          is_deleted: false,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }),
      ),
    });
    expect(uuidVersion(responseBody.id)).toEqual(4);
    expect(responseBody.items.length).toBe(10);

    expect(Date.parse(responseBody.created_at)).not.toBeNaN();
    expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
  });
});
