import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { chatsTable, messagesTable } from "@/config/schema";
import { eq, sql as drizzleSql } from "drizzle-orm";

export async function GET(req, { params }) {
  try {
    const { userId } = params;

    // Auth: only allow the user themself
    const clerkUser = await currentUser();
    if (!clerkUser || clerkUser.id !== userId) {
      console.warn("Unauthorized stats request:", { clerkUserId: clerkUser?.id, userId });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Fetching stats for user:", userId);

    // Optimize: Run all queries in parallel for better performance
    const [totalChatsRes, totalMessagesRes, learningSpanRes] = await Promise.all([
      // total chats
      db
        .select({ count: drizzleSql`count(*)` })
        .from(chatsTable)
        .where(eq(chatsTable.userId, userId)),
        
      // total messages (all messages from user's chats - both user and AI messages)
      db
        .select({ count: drizzleSql`count(*)` })
        .from(messagesTable)
        .innerJoin(chatsTable, eq(messagesTable.chatId, chatsTable.id))
        .where(eq(chatsTable.userId, userId)),
        
      // learning span (days) - based on all messages from user's chats
      db
        .select({
          first: drizzleSql`min(${messagesTable.createdAt})`,
          last: drizzleSql`max(${messagesTable.createdAt})`,
        })
        .from(messagesTable)
        .innerJoin(chatsTable, eq(messagesTable.chatId, chatsTable.id))
        .where(eq(chatsTable.userId, userId))
    ]);

    // Process results
    const totalChats = Number(totalChatsRes?.[0]?.count) || 0;
    const totalMessages = Number(totalMessagesRes?.[0]?.count) || 0;
    const avgPerChat = totalChats > 0 ? +(totalMessages / totalChats).toFixed(1) : 0;

    const first = learningSpanRes?.[0]?.first ? new Date(learningSpanRes[0].first) : null;
    const last = learningSpanRes?.[0]?.last ? new Date(learningSpanRes[0].last) : null;
    const daysLearning =
      first && last
        ? Math.max(1, Math.ceil((last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24))) + 1
        : 0;

    const payload = {
      totalChats,
      totalMessages,
      avgPerChat,
      daysLearning,
    };

    console.log("Stats payload:", payload);

    return NextResponse.json(payload);
  } catch (err) {
    console.error("Stats GET error:", err);
    return NextResponse.json({ success: false, message: "Server error", error: err.message }, { status: 500 });
  }
}
