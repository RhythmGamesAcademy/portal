CREATE TYPE "public"."student_status" AS ENUM('active', 'suspended', 'withdrawn', 'expelled');--> statement-breakpoint
CREATE TYPE "public"."term_status" AS ENUM('planned', 'registration', 'active', 'grading', 'closed');--> statement-breakpoint
CREATE TABLE "students" (
	"student_id" varchar(16) PRIMARY KEY NOT NULL,
	"discord_hash" char(64) NOT NULL,
	"entered_term" varchar(8) NOT NULL,
	"status" "student_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "students_discord_hash_unique" UNIQUE("discord_hash")
);
--> statement-breakpoint
CREATE TABLE "terms" (
	"term_code" varchar(8) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"starts_on" date NOT NULL,
	"ends_on" date NOT NULL,
	"makeup_ends_on" date,
	"status" "term_status" DEFAULT 'planned' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_entered_term_terms_term_code_fk" FOREIGN KEY ("entered_term") REFERENCES "public"."terms"("term_code") ON DELETE no action ON UPDATE no action;