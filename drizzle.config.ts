import type { Config } from "drizzle-kit";

/**
 * drizzle-kit は Next.js と違い .env.local を自動では読まないため、明示的に読み込む。
 * Vercel など環境変数が既に注入されている場所ではファイルが無いので、
 * 見つからなくても無視して先に進む。
 */
for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // ファイルが無い場合は既存の環境変数をそのまま使う
  }
}

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
} satisfies Config;
