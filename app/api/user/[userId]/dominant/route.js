// app/api/user/[userId]/dominant/route.js
import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function POST(req, { params }) {
  try {
    const { userId } = params;
    const clerkUser = await currentUser();

    if (!clerkUser || clerkUser.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { dominant_side } = await req.json();
    if (!dominant_side) {
      return NextResponse.json({ error: "Missing dominant_side" }, { status: 400 });
    }

    // If user row missing, insert; else update
    const users = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
    if (users.length === 0) {
      await db.insert(usersTable).values({
        id: userId,
        name: clerkUser.fullName ?? "",
        email: clerkUser.emailAddresses?.[0]?.emailAddress ?? "",
        dominant_side,
      });
    } else {
      await db.update(usersTable).set({ dominant_side }).where(eq(usersTable.id, userId));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("dominant POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ GET route — Fetch dominant side for user
export async function GET(request, { params }) {
  try {
    const { userId } = params;

    // Check if user exists
    const userResult = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const user = userResult[0];

    return NextResponse.json({
      success: true,
      userId: user.id,
      dominant_side: user.dominant_side || null,
    });
  } catch (error) {
    console.error("❌ GET /dominant route error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

