import {
  integer,
  pgTable,
  serial,
  timestamp,
  text,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

// ✅ users table
export const usersTable = pgTable("users", {
  id: text("id").primaryKey(), // ✅ This should store Clerk's user.id (user_XXXX)
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  dominant_side: text("dominant_side"),
});


// ✅ chats table
export const chatsTable = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// ✅ messages table
export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id")
    .notNull()
    .references(() => chatsTable.id),
  userId: text("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ✅ assessments table
export const assessmentsTable = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => usersTable.id)
    .notNull(),
  leftScore: integer("left_score").notNull(),
  rightScore: integer("right_score").notNull(),
  dominantSide: text("dominant_side").notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
