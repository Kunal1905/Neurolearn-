// config/db.ts
import "dotenv/config"
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, sql as drizzleSql } from "drizzle-orm";
import { chatsTable, messagesTable } from "./schema";

// ✅ Create connection
const neonClient = neon(process.env.DATABASE_URL);
export const db = drizzle(neonClient);

// ✅ Utility function (no duplicate sql)
export async function getUserStats(userId) {
  const totalChats = await db
    .select({ count: drizzleSql`count(*)` })
    .from(chatsTable)
    .where(eq(chatsTable.userId, userId));

  const totalMessages = await db
    .select({ count: drizzleSql`count(*)` })
    .from(messagesTable)
    .where(eq(messagesTable.userId, userId));

  const avgPerChat =
    totalChats[0]?.count > 0
      ? totalMessages[0].count / totalChats[0].count
      : 0;

  const learningSpan = await db
    .select({
      first: drizzleSql<Date>`min(${messagesTable.createdAt})`,
      last: drizzleSql<Date>`max(${messagesTable.createdAt})`,
    })
    .from(messagesTable)
    .where(eq(messagesTable.userId, userId));

  const daysLearning =
    learningSpan[0].first && learningSpan[0].last
      ? Math.ceil(
          (learningSpan[0].last.getTime() -
            learningSpan[0].first.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  return {
    totalChats: totalChats[0]?.count || 0,
    totalMessages: totalMessages[0]?.count || 0,
    avgPerChat,
    daysLearning,
  };
}
