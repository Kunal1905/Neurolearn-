import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { assessmentsTable, usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const user = await currentUser();
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.emailAddresses[0].emailAddress;
    const clerkUserId = user.id;
    const fullName = user.fullName || "";

    // ✅ Step 1: Ensure user exists (fetch or insert)
    let [dbUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    // ✅ Only insert if user does not exist
    if (!dbUser) {
      [dbUser] = await db
        .insert(usersTable)
        .values({
          id: clerkUserId,
          email,
          name: fullName,
        })
        .returning();
    }

    // ✅ Step 2: Parse incoming request
    const { left, right, dominant_side } = await req.json();

    // ✅ Step 3: Check if assessment already exists for this user
    const existing = await db
      .select()
      .from(assessmentsTable)
      .where(eq(assessmentsTable.userId, dbUser.id))
      .limit(1);

    if (existing.length > 0) {
      // Return already saved assessment
      const e = existing[0];
      return NextResponse.json({
        success: true,
        message: "Assessment already exists",
        data: {
          leftScore: e.leftScore,
          rightScore: e.rightScore,
          dominantSide: e.dominantSide,
        },
      });
    }

    // ✅ Step 4: Insert assessment if it does not exist
    const [result] = await db
      .insert(assessmentsTable)
      .values({
        userId: dbUser.id,
        leftScore: left,
        rightScore: right,
        dominantSide: dominant_side,
        completed: true,
      })
      .returning();

    // ✅ Step 5: Update user's dominant side (optional)
    await db
      .update(usersTable)
      .set({ dominant_side })
      .where(eq(usersTable.id, dbUser.id));

    return NextResponse.json({
      success: true,
      data: {
        leftScore: result.leftScore,
        rightScore: result.rightScore,
        dominantSide: result.dominantSide,
      },
    });
  } catch (error) {
    console.error("❌ Assessment route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while saving assessment.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

