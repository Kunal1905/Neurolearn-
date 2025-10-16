import { currentUser } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const clerkUser = await currentUser();
    const clerkUserId = clerkUser?.id;
    const { name, email } = await req.json();

    if (!email || !clerkUserId) {
      return NextResponse.json({ success: false, error: "Email or user ID missing" }, { status: 400 });
    }

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    let user;

    if (existingUser.length > 0) {
      user = existingUser[0];
    } else {
      const inserted = await db.insert(usersTable).values({
        id: clerkUserId,
        name: name || "Unnamed User",
        email,
      }).returning();

      user = inserted[0];
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("❌ Error creating/fetching user:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
