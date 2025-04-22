import { NextRequest, NextResponse } from "next/server";

type ROLES = "ADMIN" | "SUPERVISOR" | "EVALUATOR";

export function authorization(...params: ROLES[]) {
  return async (request: NextRequest) => {
    try {
      const role = request.headers.get("x-user-role") as ROLES;

      const confirm = params.includes(role);

      if (confirm) {
        return null;
      }

      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    } catch {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  };
}
