import jwt from "jsonwebtoken";

export async function decrypt(session: string | undefined = "") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const verifiedToken: any = jwt.verify(
      session,
      process.env.JWT_SECRET || "",
    );

    return verifiedToken;
  } catch {
    console.log("Failed to verify session");
  }
}
