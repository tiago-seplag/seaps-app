/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

import { z, ZodError } from "zod";

export function validation(schema: z.ZodObject<any, any>) {
  return async (request: NextRequest) => {
    const body = await request.clone().json();
    try {
      schema.parse(body);
      return null;
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((issue: any) => ({
          message: `${issue.path} is ${issue.message.toLowerCase()}`,
        }));
        return NextResponse.json(
          { error: "validtion data", messages },
          { status: 400 },
        );
      }
      return NextResponse.json({ status: `unknown error` }, { status: 500 });
    }
  };
}
