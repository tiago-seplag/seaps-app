import crypto from "node:crypto";
import { db } from "@/infra/database";

const EXPIRATION_IN_MILLISECONDS = 60 * 60 * 24 * 30 * 1000; // 30 Days

async function createSession(
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

export { createSession, EXPIRATION_IN_MILLISECONDS };
