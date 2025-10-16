import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { assessmentsTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function GET(req, { params }) {
  try {
    const { userId } = params; // ✅ Extract param

    console.log("📩 Fetching assessment for:", userId);

    const results = await db
      .select()
      .from(assessmentsTable)
      .where(eq(assessmentsTable.userId, userId)) // ✅ FIXED
      .limit(1);

    console.log("🧠 Assessment Results:", results);

    if (!results || results.length === 0) {
      return NextResponse.json(
        { success: false, message: "No assessment found" },
        { status: 404 }
      );
    }

    const assessment = results[0];

    return NextResponse.json({
      success: true,
      dominantSide: assessment.dominantSide,
      leftScore: assessment.leftScore,
      rightScore: assessment.rightScore,
    });
  } catch (error) {
    console.error("❌ Error fetching assessment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
