-- Drop foreign key constraints first
ALTER TABLE "assessments" DROP CONSTRAINT IF EXISTS "assessments_user_id_users_id_fk";--> statement-breakpoint
ALTER TABLE "chats" DROP CONSTRAINT IF EXISTS "chats_user_id_users_id_fk";--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "messages_user_id_users_id_fk";--> statement-breakpoint

-- Change the id column type
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint

-- Recreate foreign key constraints
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");