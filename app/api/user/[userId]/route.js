import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function GET(req) {
  const userId = params.id;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, Number(userId)));

  return NextResponse.json(user || {});
}
