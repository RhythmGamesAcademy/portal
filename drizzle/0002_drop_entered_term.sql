-- 既存行の入学コホートを旧 entered_term から復元してから NOT NULL を課す。
-- 期コードは 3 文字（例: "26S"）であり、student_id の接頭辞と同じ値である。
-- entered_term を落とす前に実行する必要がある。
UPDATE "students" SET "entered_cohort" = left("entered_term", 3) WHERE "entered_cohort" IS NULL;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "entered_cohort" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "students" DROP CONSTRAINT "students_entered_term_terms_term_code_fk";--> statement-breakpoint
ALTER TABLE "students" DROP COLUMN "entered_term";
