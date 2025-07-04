import { db } from "@/infra/database";
import { hash } from "@/models/password";
import { createUser } from "@/models/user";

async function clearDatabase() {
  await db.raw("drop schema public cascade; create schema public;");
}

async function runMigrations() {
  await db.migrate.latest();
}

async function createOrganizations() {
  await db("organizations").insert([
    { id: "org-1", name: "Organization 1" },
    { id: "org-2", name: "Organization 2" },
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
    password: await hash(password || "default-password"),
  });

  return user;
}

const orchestrator = {
  clearDatabase,
  runMigrations,
  createUser: orchestratorCreateUser,
  createOrganizations,
};

export default orchestrator;
