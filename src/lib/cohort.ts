/**
 * 入学コホートの期コード。学籍番号の先頭3文字になる。
 *
 * 期コードは terms テーブルを参照せず、発行日時だけから決まる純粋関数の値である。
 * 学務上の学期（terms）と入学コホートは別概念のため、両者を結び付けない。
 */

/** JST は UTC+9 固定で夏時間を持たない */
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** 期コードの桁数。students.entered_cohort の char(3) と対応する */
export const COHORT_CODE_LENGTH = 3;

/**
 * JST における暦日を取り出す。
 *
 * Vercel のランタイムは UTC で動くため、サーバーローカル時刻のまま判定すると
 * 境界日（02/14〜02/15, 08/14〜08/15）の前後 9 時間で誤った期コードを発行する。
 * JST は固定オフセットなので、9 時間進めて UTC として読めば厳密に一致する。
 */
function jstParts(at: Date): { year: number; month: number; day: number } {
  const jst = new Date(at.getTime() + JST_OFFSET_MS);
  return {
    year: jst.getUTCFullYear(),
    month: jst.getUTCMonth() + 1,
    day: jst.getUTCDate(),
  };
}

function twoDigitYear(year: number): string {
  return String(year % 100).padStart(2, "0");
}

/**
 * 発行日時に対応する期コードを返す。
 *
 * 08/15 〜 翌 02/14 … {開始年の下2桁}W
 * 02/15 〜 08/14    … {年の下2桁}S
 *
 * 例: 2026-09-05 → "26W" / 2027-01-10 → "26W" / 2027-03-01 → "27S"
 *
 * この関数は students への INSERT 時にのみ呼ぶこと。
 * 発行済みの学籍から読み出すときに再計算してはならない。
 * 期コードは students.entered_cohort と student_id に確定保存された不変値であり、
 * 再計算すると同じ学生が時期によって別の値を持つことになる。
 */
export function cohortCode(at: Date): string {
  const time = at.getTime();
  if (!Number.isFinite(time)) {
    throw new RangeError("期コードの決定に不正な日時が渡されました。");
  }

  const { year, month, day } = jstParts(at);

  // W 期は年をまたぐ。08/15 以降はその年に始まった W 期
  if (month > 8 || (month === 8 && day >= 15)) return `${twoDigitYear(year)}W`;
  // 02/14 以前は前年に始まった W 期の途中
  if (month < 2 || (month === 2 && day <= 14)) return `${twoDigitYear(year - 1)}W`;
  return `${twoDigitYear(year)}S`;
}
