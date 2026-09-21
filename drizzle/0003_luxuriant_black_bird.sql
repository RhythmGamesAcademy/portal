CREATE TYPE "public"."course_status" AS ENUM('planned', 'active', 'closed');--> statement-breakpoint
CREATE TYPE "public"."enrollment_status" AS ENUM('enrolled', 'withdrawn', 'completed');--> statement-breakpoint
CREATE TYPE "public"."grade_audit_action" AS ENUM('created', 'updated', 'published', 'unpublished');--> statement-breakpoint
CREATE TYPE "public"."grade_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "course_instructors" (
	"course_id" text NOT NULL,
	"student_id" varchar(16) NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "course_instructors_course_id_student_id_pk" PRIMARY KEY("course_id","student_id")
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" text PRIMARY KEY NOT NULL,
	"term_code" varchar(8) NOT NULL,
	"title" text NOT NULL,
	"status" "course_status" DEFAULT 'planned' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"student_id" varchar(16) NOT NULL,
	"status" "enrollment_status" DEFAULT 'enrolled' NOT NULL,
	"enrolled_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grade_audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"enrollment_id" text NOT NULL,
	"action" "grade_audit_action" NOT NULL,
	"previous_score" smallint,
	"new_score" smallint,
	"changed_by_student_id" varchar(16) NOT NULL,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "grade_audit_previous_score_range" CHECK ("grade_audit_logs"."previous_score" IS NULL OR ("grade_audit_logs"."previous_score" >= 0 AND "grade_audit_logs"."previous_score" <= 100)),
	CONSTRAINT "grade_audit_new_score_range" CHECK ("grade_audit_logs"."new_score" IS NULL OR ("grade_audit_logs"."new_score" >= 0 AND "grade_audit_logs"."new_score" <= 100))
);
--> statement-breakpoint
CREATE TABLE "grades" (
	"enrollment_id" text PRIMARY KEY NOT NULL,
	"score" smallint NOT NULL,
	"status" "grade_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by_student_id" varchar(16) NOT NULL,
	CONSTRAINT "grades_score_range" CHECK ("grades"."score" >= 0 AND "grades"."score" <= 100),
	CONSTRAINT "grades_published_at_required" CHECK ("grades"."status" <> 'published' OR "grades"."published_at" IS NOT NULL)
);
--> statement-breakpoint
ALTER TABLE "course_instructors" ADD CONSTRAINT "course_instructors_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_instructors" ADD CONSTRAINT "course_instructors_student_id_students_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("student_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_term_code_terms_term_code_fk" FOREIGN KEY ("term_code") REFERENCES "public"."terms"("term_code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_students_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("student_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grade_audit_logs" ADD CONSTRAINT "grade_audit_logs_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grade_audit_logs" ADD CONSTRAINT "grade_audit_logs_changed_by_student_id_students_student_id_fk" FOREIGN KEY ("changed_by_student_id") REFERENCES "public"."students"("student_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grades" ADD CONSTRAINT "grades_enrollment_id_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grades" ADD CONSTRAINT "grades_updated_by_student_id_students_student_id_fk" FOREIGN KEY ("updated_by_student_id") REFERENCES "public"."students"("student_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "enrollments_course_student_unique" ON "enrollments" USING btree ("course_id","student_id");