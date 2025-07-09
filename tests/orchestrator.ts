import { db } from "@/infra/database";
import { createSession } from "@/models/session";
import user from "@/models/user";
import model from "@/models/model";
import property from "@/models/property";

async function clearDatabase() {
  await db.raw("drop schema public cascade; create schema public;");
}

async function runMigrations() {
  await db.migrate.latest();
}

async function createOrganizations() {
  const organizations = await db("organizations")
    .insert([
      { acronym: "SESP", name: "SEGURANCA" },
      { acronym: "SEPLAG", name: "PLANEJAMENTO" },
      { acronym: "SES", name: "SAUDE" },
    ])
    .returning("*");

  return organizations;
}

async function createUser({
  email,
  password,
}: {
  email?: string;
  password?: string;
}) {
  const createdUser = await user.createUser({
    name: "Default User",
    role: "ADMIN",
    cpf: "12345678901",
    email: email || "default-user@email.com",
    password: password || "default-password",
  });

  await user.updateUser(createdUser.id, { is_active: true, role: "ADMIN" });

  return createdUser;
}

async function orchestratorCreateSession(userId: string) {
  const session = await createSession(userId, {
    userAgent: "orchestrator-test",
    type: "password",
  });

  return session;
}

async function createProperty(organizationId: string) {
  const createdProperty = await property.createProperty({
    name: "Test Property",
    organization_id: organizationId,
    address: "123 Test St",
    type: "OWN",
  });

  return createdProperty;
}

async function createModel() {
  const createdModel = await model.createModel({
    name: "Test Model",
    description: "This is a test model",
    items: [
      { name: "Test Item 1" },
      { name: "Test Item 2" },
      { name: "Test Item 3" },
      { name: "Test Item 4" },
      { name: "Test Item 5" },
      { name: "Test Item 6" },
      { name: "Test Item 7" },
      { name: "Test Item 8" },
      { name: "Test Item 9" },
      { name: "Test Item 10" },
    ],
  });

  return createdModel;
}

const orchestrator = {
  clearDatabase,
  runMigrations,
  createOrganizations,
  createUser,
  createSession: orchestratorCreateSession,
  createModel,
  createProperty,
};

export default orchestrator;
