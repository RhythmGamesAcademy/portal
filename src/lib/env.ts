/**
 * 環境変数の遅延読み出し。
 * モジュール読み込み時ではなく実際に参照された時点で検証するため、
 * 変数が未設定でも `next build` は通る（起動時・リクエスト時に失敗する）。
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`環境変数 ${name} が設定されていません。.env.example を参照してください。`);
  }
  return value;
}

export function optionalEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}
