/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type ROLES = "ADMIN" | "SUPERVISOR" | "EVALUATOR";

export function authorization(...params: ROLES[]) {
  return async (request: NextRequest) => {
    try {
      const verifiedToken: any = jwt.verify(
        request.cookies.get("SESSION")!.value,
        process.env.JWT_SECRET || "",
      );

      const confirm = params.includes(verifiedToken.role);

      if (confirm) {
        return null;
      }

      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    } catch {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  };
}
