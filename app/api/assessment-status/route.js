import { db } from "@/config/db";
import { assessmentsTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET(req) {
  try {
    // Get current user from Clerk
    const user = await currentUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }

    const userId = user.id;
    
    // Check assessment for the logged-in user
    const result = await db
      .select()
      .from(assessmentsTable)
      .where(eq(assessmentsTable.userId, userId))
      .limit(1);

    if (result.length > 0) {
      const existing = result[0];

      return new Response(
        JSON.stringify({
          exists: true,
          leftScore: existing.leftScore,
          rightScore: existing.rightScore,
          dominantSide: existing.dominantSide,
          createdAt: existing.createdAt,
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // No assessment found → allow test
    return new Response(
      JSON.stringify({ exists: false }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (err) {
    console.error("❌ Error checking assessment:", err);
    return new Response(
      JSON.stringify({ error: "Server error", details: err.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
