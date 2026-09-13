import { eq } from "drizzle-orm";
import { db } from "@/db";
import { terms, type Term } from "@/db/schema";

/**
 * 学務上の学期の読み出し。
 *
 * Phase 1 ではどこからも呼ばれない。履修登録と成績評価を実装する段階で使う。
 * 学籍番号の期コードは入学日から純粋関数で決まるため（src/lib/cohort.ts）、
 * 学籍の発行経路からこの表を参照してはならない。
 */
export async function findTerm(termCode: string): Promise<Term | null> {
  const rows = await db.select().from(terms).where(eq(terms.termCode, termCode)).limit(1);
  return rows[0] ?? null;
}
