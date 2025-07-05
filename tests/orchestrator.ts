import { db } from "@/infra/database";
import { createSession } from "@/models/session";
import { createUser } from "@/models/user";

async function clearDatabase() {
  await db.raw("drop schema public cascade; create schema public;");
}

async function runMigrations() {
  await db.migrate.latest();
}

async function createOrganizations() {
  await db("organizations").insert([
    { acronym: "SESP", name: "SEGURANCA" },
    { acronym: "SEPLAG", name: "PLANEJAMENTO" },
    { acronym: "SES", name: "SAUDE" },
  ]);
}

async function orchestratorCreateUser({
  email,
  password,
}: {
  email?: string;
  password?: string;
}) {
  const user = await createUser({
    name: "Default User",
    role: "ADMIN",
    cpf: "12345678901",
    email: email || "default-user@email.com",
    password: password || "default-password",
  });

  return user;
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
