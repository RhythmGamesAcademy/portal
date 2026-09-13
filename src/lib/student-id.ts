import { createHmac } from "node:crypto";
import { requireEnv } from "./env";

/** Crockford Base32。I / L / O / U を除いた32文字 */
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** 学籍番号本体の桁数。32^6 = 約10.7億 */
const BODY_LENGTH = 6;

/**
 * HMAC の入力に付けるドメイン分離プレフィックス。
 * 引き当てキーと学籍番号本体で別の値を導出し、
 * 衝突リトライで本体を振り直しても引き当てキーが不変であることを保証する。
 */
const LOOKUP_PREFIX = "lookup:v1:";
const SID_PREFIX = "sid:v1:";

/** 学籍番号の衝突時に本体を振り直す最大回数 */
export const MAX_ISSUE_ATTEMPTS = 10;

function hmac(message: string): Buffer {
  return createHmac("sha256", requireEnv("RGA_STUDENT_ID_SALT"))
    .update(message, "utf8")
    .digest();
}

/**
 * students.discord_hash に保存する値。
 * 試行回数に依存しないので、何度ログインしても同じレコードに到達する。
 */
export function lookupHash(discordId: string): string {
  return hmac(LOOKUP_PREFIX + discordId).toString("hex");
}

/**
 * 学籍番号本体。attempt は 0 から始まり、UNIQUE 制約違反のたびに 1 ずつ進める。
 * attempt = 0 も例外扱いせず常に "#0" を付与する。
 */
export function studentIdBody(discordId: string, attempt: number): string {
  return encodeCrockford(hmac(`${SID_PREFIX}${discordId}#${attempt}`), BODY_LENGTH);
}

export function buildStudentId(cohort: string, discordId: string, attempt: number): string {
  return cohort + studentIdBody(discordId, attempt);
}

/**
 * ダイジェスト先頭の length * 5 ビットを Crockford Base32 に符号化する。
 * ビット列の先頭から 5 ビットずつ切り出す（length <= 50 で安全）。
 */
function encodeCrockford(digest: Buffer, length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    const bitOffset = i * 5;
    const byteIndex = bitOffset >> 3;
    const bitShift = bitOffset & 7;
    // 該当バイトと次のバイトで 16 ビット窓を作り、目的の 5 ビットを下位に落とす
    const window = (digest[byteIndex] << 8) | digest[byteIndex + 1];
    out += ALPHABET[(window >>> (11 - bitShift)) & 31];
  }
  return out;
}
