import { db } from "@/infra/database";
import user from "@/models/user";
import model from "@/models/model";
import property from "@/models/property";
import checklist from "@/models/checklist";
import session from "@/models/session";

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

  const updatedUser = await user.updateUser(createdUser.id, {
    is_active: true,
    role: "ADMIN",
    permissions: ["*", "avaliator"],
  });

  return updatedUser;
}

async function orchestratorCreateSession(userId: string) {
  const createdSession = await session.create(userId, {
    userAgent: "orchestrator-test",
    type: "password",
  });

  return createdSession;
}

async function createProperty(organizationId: string) {
  const [person] = await db("persons")
    .insert({
      name: "Default Person",
      email: "default-user@email.com",
      phone: "65984123456",
      organization_id: organizationId,
      role: "ADMIN",
    })
    .returning("*");

  const createdProperty = await property.create({
    name: "Test Property",
    organization_id: organizationId,
    address: "123 Test St",
    type: "OWN",
  });

  await property.updatePerson(createdProperty.id, person.id);

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

async function createChecklist(data: {
  organization_id: string;
  property_id: string;
  model_id: string;
  user_id: string;
}) {
  const createdChecklist = await checklist.createChecklist(data);

  return createdChecklist;
}

const orchestrator = {
  clearDatabase,
  runMigrations,
  createOrganizations,
  createUser,
  createSession: orchestratorCreateSession,
  createModel,
  createProperty,
  createChecklist,
};

export default orchestrator;
