import { eq } from "drizzle-orm";
import { db } from "@/db";
import { students, type Student } from "@/db/schema";
import { cohortCode } from "@/lib/cohort";
import { buildStudentId, lookupHash, MAX_ISSUE_ATTEMPTS } from "@/lib/student-id";

/** 規定回数の振り直しでも学籍番号の衝突を解消できなかった */
export class StudentIdExhaustedError extends Error {
  constructor() {
    super(`学籍番号の採番に ${MAX_ISSUE_ATTEMPTS} 回連続で失敗しました。`);
    this.name = "StudentIdExhaustedError";
  }
}

const UNIQUE_VIOLATION = "23505";

type PostgresError = { code?: string; constraint?: string; detail?: string };

/**
 * Postgres のエラー情報を取り出す。
 * drizzle-orm はドライバのエラーを DrizzleQueryError の cause に包むため、
 * code を持つ層に行き当たるまで cause を辿る。
 */
function postgresError(error: unknown): PostgresError | null {
  let current: unknown = error;

  for (let depth = 0; current !== null && current !== undefined && depth < 5; depth++) {
    if (typeof current === "object" && typeof (current as PostgresError).code === "string") {
      return current as PostgresError;
    }
    current = (current as { cause?: unknown }).cause;
  }

  return null;
}

function uniqueViolationTarget(error: unknown): "student_id" | "discord_hash" | null {
  const pg = postgresError(error);
  if (pg?.code !== UNIQUE_VIOLATION) return null;

  const subject = `${pg.constraint ?? ""} ${pg.detail ?? ""}`;
  if (subject.includes("discord_hash")) return "discord_hash";
  // 主キー制約名 (students_pkey) には列名が現れないため、既定を student_id とする
  return "student_id";
}

export async function findStudentByHash(discordHash: string): Promise<Student | null> {
  const rows = await db
    .select()
    .from(students)
    .where(eq(students.discordHash, discordHash))
    .limit(1);
  return rows[0] ?? null;
}

/**
 * ログイン中の Discord ID に対応する学籍を返す。無ければ発行する。
 *
 * 生の Discord ID を受け取るのはこの関数だけで、保存するのは HMAC ダイジェストのみ。
 * 既存レコードがあれば必ずそれを返すため、期コードは初回発行時のまま固定される。
 * cohortCode を呼ぶのはこの INSERT 経路だけで、読み出し時に再計算はしない。
 */
export async function ensureStudent(discordId: string): Promise<Student> {
  const discordHash = lookupHash(discordId);

  const existing = await findStudentByHash(discordHash);
  if (existing) return existing;

  // 発行の瞬間に確定させ、リトライ間で揺らがないよう先に一度だけ求める
  const cohort = cohortCode(new Date());

  for (let attempt = 0; attempt < MAX_ISSUE_ATTEMPTS; attempt++) {
    const studentId = buildStudentId(cohort, discordId, attempt);

    try {
      const inserted = await db
        .insert(students)
        .values({ studentId, discordHash, enteredCohort: cohort })
        .returning();
      return inserted[0];
    } catch (error) {
      switch (uniqueViolationTarget(error)) {
        case "student_id":
          // 別人に同じ学籍番号が割り当たっている。本体を振り直して再試行する
          continue;
        case "discord_hash": {
          // 同一ユーザーの並行リクエストが先に発行した。そちらを採用する
          const raced = await findStudentByHash(discordHash);
          if (raced) return raced;
          throw error;
        }
        default:
          throw error;
      }
    }
  }

  throw new StudentIdExhaustedError();
}
