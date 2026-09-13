/** 音楽ゲーム学園 Discord サーバー。秘密情報ではないため定数として持つ */
export const ACADEMY_GUILD_ID = "1518532514489307218";

const GUILDS_ENDPOINT = "https://discord.com/api/v10/users/@me/guilds?limit=200";

type PartialGuild = { id: string };

/**
 * アクセストークンの持ち主が学園の Discord サーバーに所属しているかを確認する。
 * Discord の所属上限は 200 のため 1 回の取得でページングは不要。
 */
export async function isAcademyMember(accessToken: string): Promise<boolean> {
  const response = await fetch(GUILDS_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Discord のギルド一覧を取得できませんでした (HTTP ${response.status})`);
  }

  const guilds = (await response.json()) as PartialGuild[];
  return guilds.some((guild) => guild.id === ACADEMY_GUILD_ID);
}
