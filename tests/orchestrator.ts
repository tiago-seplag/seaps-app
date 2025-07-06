import { db } from "@/infra/database";
import { createSession } from "@/models/session";
import user from "@/models/user";

async function clearDatabase() {
  await db.raw("drop schema public cascade; create schema public;");
}

async function runMigrations() {
  await db.migrate.latest();
}

async function createOrganizations() {
  const organizations = await db("organizations").insert([
    { acronym: "SESP", name: "SEGURANCA" },
    { acronym: "SEPLAG", name: "PLANEJAMENTO" },
    { acronym: "SES", name: "SAUDE" },
  ]);

  return organizations;
}

async function orchestratorCreateUser({
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

const orchestrator = {
  clearDatabase,
  runMigrations,
  createOrganizations,
  createUser: orchestratorCreateUser,
  createSession: orchestratorCreateSession,
};

export default orchestrator;
