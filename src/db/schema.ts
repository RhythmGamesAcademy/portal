import { check, char, date, pgEnum, pgTable, primaryKey, smallint, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { COHORT_CODE_LENGTH } from "@/lib/cohort";

/**
 * 学期の状態。
 * planned      … 未開始。学園規則第3章第4条の付番のみ済んでいる状態
 * registration … 募集期間中（規則第3章第3条）。正規活動期間の開始後も継続しうる
 * active       … 正規活動期間中（規則第3章第2条第2項）
 * grading      … 補講期間および成績評価期間
 * closed       … 終了
 */
export const termStatus = pgEnum("term_status", [
  "planned",
  "registration",
  "active",
  "grading",
  "closed",
]);

/**
 * 学籍の状態。
 * active     … 在籍
 * suspended  … 活動停止（規則第8章）
 * withdrawn  … 退会（規則第4章第6条）
 * expelled   … 除名（規則第4章第7条）
 */
export const studentStatus = pgEnum("student_status", [
  "active",
  "suspended",
  "withdrawn",
  "expelled",
]);

/**
 * 学務上の学期。
 *
 * Phase 1 では使用しない。履修登録と成績評価を実装する段階で参照する。
 * 入学コホート（students.entered_cohort）はこの表とは無関係に決まるため、
 * 学籍の発行経路からこの表を参照してはならない。
 */
export const terms = pgTable("terms", {
  /** 学期コード。例: "26S" */
  termCode: varchar("term_code", { length: 8 }).primaryKey(),
  /** 表示名。例: "2026年度 後学期（#3期）" */
  name: text("name").notNull(),
  /** 学期の開始日（規則第3章第2条第1項）。例: 2026-10-01 */
  startsOn: date("starts_on").notNull(),
  /** 正規活動期間の末日（規則第3章第2条第2項）。例: 2027-01-31 */
  endsOn: date("ends_on").notNull(),
  /**
   * 補講期間の末日（規則第3章第2条第2項）。例: 2027-02-15
   * 補講期間は ends_on の翌日から makeup_ends_on までとして表現する。
   * 補講期間を設けない学期では null。
   */
  makeupEndsOn: date("makeup_ends_on"),
  status: termStatus("status").notNull().default("planned"),
});

export const students = pgTable("students", {
  /** 学籍番号。{期コード}{Crockford Base32 6桁}。例: "26WK7M2QP" */
  studentId: varchar("student_id", { length: 16 }).primaryKey(),
  /**
   * HMAC-SHA256("lookup:v1:" + discordId) の16進64文字。
   * Discord ID そのものは保存しない。この列がログイン時の唯一の引き当てキーとなる。
   */
  discordHash: char("discord_hash", { length: 64 }).notNull().unique(),
  /**
   * 入学コホートの期コード。student_id の先頭3文字と同じ値。
   * 発行日時から純粋関数で決まる（src/lib/cohort.ts）。
   * 入学コホートは学務上の学期とは別概念のため terms を参照しない。
   * 初回発行時の値を保持し、再入会しても変更しない（規則第4章第5条）。
   */
  enteredCohort: char("entered_cohort", { length: COHORT_CODE_LENGTH }).notNull(),
  status: studentStatus("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const courseStatus = pgEnum("course_status", ["planned", "active", "closed"]);
export const enrollmentStatus = pgEnum("enrollment_status", ["enrolled", "withdrawn", "completed"]);
export const gradeStatus = pgEnum("grade_status", ["draft", "published"]);
export const gradeAuditAction = pgEnum("grade_audit_action", ["created", "updated", "published", "unpublished"]);

/** 成績機能の準備用。講義名は主キーから分離し、学期ごとに別レコードを持つ。 */
export const courses = pgTable("courses", {
  id: text("id").primaryKey(),
  termCode: varchar("term_code", { length: 8 }).notNull().references(() => terms.termCode),
  title: text("title").notNull(),
  status: courseStatus("status").notNull().default("planned"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const courseInstructors = pgTable("course_instructors", {
  courseId: text("course_id").notNull().references(() => courses.id),
  studentId: varchar("student_id", { length: 16 }).notNull().references(() => students.studentId),
  assignedAt: timestamp("assigned_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [primaryKey({ columns: [table.courseId, table.studentId] })]);

export const enrollments = pgTable("enrollments", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull().references(() => courses.id),
  studentId: varchar("student_id", { length: 16 }).notNull().references(() => students.studentId),
  status: enrollmentStatus("status").notNull().default("enrolled"),
  enrolledAt: timestamp("enrolled_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("enrollments_course_student_unique").on(table.courseId, table.studentId)]);

/**
 * 成績は100点満点の整数だけを保存する。制度上、小数を受け付ける将来の入力処理では
 * 保存前に Math.ceil 相当で切り上げ、計算前の小数値はDBへ保存しない。
 */
export const grades = pgTable("grades", {
  enrollmentId: text("enrollment_id").primaryKey().references(() => enrollments.id),
  score: smallint("score").notNull(),
  status: gradeStatus("status").notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  updatedByStudentId: varchar("updated_by_student_id", { length: 16 }).notNull().references(() => students.studentId),
}, (table) => [
  check("grades_score_range", sql`${table.score} >= 0 AND ${table.score} <= 100`),
  check("grades_published_at_required", sql`${table.status} <> 'published' OR ${table.publishedAt} IS NOT NULL`),
]);

export const gradeAuditLogs = pgTable("grade_audit_logs", {
  id: text("id").primaryKey(),
  enrollmentId: text("enrollment_id").notNull().references(() => enrollments.id),
  action: gradeAuditAction("action").notNull(),
  previousScore: smallint("previous_score"),
  newScore: smallint("new_score"),
  changedByStudentId: varchar("changed_by_student_id", { length: 16 }).notNull().references(() => students.studentId),
  changedAt: timestamp("changed_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  check("grade_audit_previous_score_range", sql`${table.previousScore} IS NULL OR (${table.previousScore} >= 0 AND ${table.previousScore} <= 100)`),
  check("grade_audit_new_score_range", sql`${table.newScore} IS NULL OR (${table.newScore} >= 0 AND ${table.newScore} <= 100)`),
]);

export type Term = typeof terms.$inferSelect;
export type Student = typeof students.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type CourseInstructor = typeof courseInstructors.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
export type Grade = typeof grades.$inferSelect;
export type GradeAuditLog = typeof gradeAuditLogs.$inferSelect;
