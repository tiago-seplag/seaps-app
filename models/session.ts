import crypto from "node:crypto";
import { db } from "@/infra/database";

const EXPIRATION_IN_MILLISECONDS = 60 * 60 * 24 * 30 * 1000; // 30 Days

async function create(
  userId: string,
  options?: { userAgent?: string | null; type?: string | null },
) {
  const token = crypto.randomBytes(48).toString("hex");

  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const session = await db("sessions")
    .insert({
      user_id: userId,
      token: token,
      expires_at: expiresAt,
      user_agent: options?.userAgent || null,
      type: options?.type || null,
      is_active: true,
    })
    .returning("*");

  return session[0];
}

async function findSessionByToken(token: string) {
  const session = await db("sessions")
    .select("*")
    .where("token", token)
    .first();

  return session;
}

async function findUserByToken(token: string) {
  const user = await db("users")
    .select(
      "users.id",
      "users.cpf",
      "users.name",
      "users.email",
      "users.avatar ",
      "users.role",
      "users.is_active",
      "users.is_deleted",
      "users.created_at",
      "users.updated_at",
    )
    .innerJoin("sessions", "sessions.user_id", "users.id")
    .where("sessions.token", token)
    .first();

  return user;
}

const session = {
  create,
  findSessionByToken,
  findUserByToken,
};

export { EXPIRATION_IN_MILLISECONDS };

export default session;
