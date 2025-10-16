import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // ✅ Simple test query
    const result = await db.execute(sql`SELECT NOW()`);
    console.log("✅ DB Connected! Result:", result);

    return NextResponse.json({
      success: true,
      message: "Database connected successfully!",
      time: result.rows?.[0]?.now || "No result",
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return NextResponse.json(
      { success: false, message: "DB connection failed", error: error.message },
      { status: 500 }
    );
  }
}
