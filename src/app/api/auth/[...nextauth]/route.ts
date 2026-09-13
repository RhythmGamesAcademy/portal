import { handlers } from "@/auth";

// HMAC 導出に node:crypto を使うため Node ランタイムで動かす
export const runtime = "nodejs";

export const { GET, POST } = handlers;
