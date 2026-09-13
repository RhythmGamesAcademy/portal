import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { requireEnv } from "@/lib/env";
import * as schema from "./schema";

type Database = NeonHttpDatabase<typeof schema>;

let instance: Database | undefined;

function resolve(): Database {
  if (!instance) {
    instance = drizzle(neon(requireEnv("DATABASE_URL")), { schema });
  }
  return instance;
}

/**
 * DATABASE_URL の解決をプロパティ参照時まで遅延させる。
 * ビルド時にモジュールが評価されても接続文字列を要求しない。
 */
export const db: Database = new Proxy({} as Database, {
  get(_target, property) {
    const target = resolve();
    const value = Reflect.get(target, property, target);
    return typeof value === "function" ? value.bind(target) : value;
  },
});

export { schema };
