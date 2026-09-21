/** 音楽ゲーム学園 Discord サーバー。秘密情報ではないため定数として持つ */
export const ACADEMY_GUILD_ID = "1518532514489307218";

const API_BASE = "https://discord.com/api/v10";
const GUILDS_ENDPOINT = `${API_BASE}/users/@me/guilds?limit=200`;
const MEMBER_ENDPOINT = `${API_BASE}/users/@me/guilds/${ACADEMY_GUILD_ID}/member`;

export type DiscordApiErrorKind =
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "rate_limited"
  | "server"
  | "invalid_response"
  | "unknown";

export class DiscordApiError extends Error {
  readonly kind: DiscordApiErrorKind;
  readonly status: number;

  constructor(kind: DiscordApiErrorKind, status: number) {
    super("Discord APIから情報を取得できませんでした。");
    this.name = "DiscordApiError";
    this.kind = kind;
    this.status = status;
  }
}

export interface DiscordGuildSummary {
  id: string;
}

export interface DiscordGuildMember {
  roles: string[];
}

function errorKind(status: number): DiscordApiErrorKind {
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 429) return "rate_limited";
  if (status >= 500) return "server";
  return "unknown";
}

async function getJson<T>(endpoint: string, accessToken: string): Promise<T> {
  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) throw new DiscordApiError(errorKind(response.status), response.status);
  try {
    return (await response.json()) as T;
  } catch {
    throw new DiscordApiError("invalid_response", response.status);
  }
}

/** アクセストークンの持ち主が学園のDiscordサーバーに所属しているか確認する。 */
export async function isAcademyMember(accessToken: string): Promise<boolean> {
  const guilds = await getJson<DiscordGuildSummary[]>(GUILDS_ENDPOINT, accessToken);
  return Array.isArray(guilds) && guilds.some((guild) => guild?.id === ACADEMY_GUILD_ID);
}

/** 本人のGuild Member情報を取得する。404はギルド未参加として扱う。 */
export async function getAcademyMember(accessToken: string): Promise<DiscordGuildMember | null> {
  const response = await fetch(MEMBER_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new DiscordApiError(errorKind(response.status), response.status);

  try {
    const body = (await response.json()) as { roles?: unknown };
    if (!Array.isArray(body.roles) || !body.roles.every((role): role is string => typeof role === "string")) {
      throw new DiscordApiError("invalid_response", response.status);
    }
    return { roles: body.roles };
  } catch (error) {
    if (error instanceof DiscordApiError) throw error;
    throw new DiscordApiError("invalid_response", response.status);
  }
}

/** ロール取得の境界。ID以外のDiscordプロフィール情報はここから返さない。 */
export async function getAcademyRoleIds(accessToken: string): Promise<string[]> {
  const member = await getAcademyMember(accessToken);
  return member?.roles ?? [];
}
