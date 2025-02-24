/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function authorization(role: string) {
  return async (request: NextRequest) => {
    try {
      const verifiedToken: any = jwt.verify(
        request.cookies.get("SESSION")!.value,
        process.env.JWT_SECRET || "",
      );

      if (verifiedToken && role) return null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_: unknown) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  };
}
