import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" }); // ✅ Load from .env.local

export default defineConfig({
  schema: "./config/schema.js",
  out: "./drizzle",
  dialect: "postgresql", // ✅ Required
  dbCredentials: {
    url: process.env.DATABASE_URL, // ✅ Reads from .env.local
  },
});
