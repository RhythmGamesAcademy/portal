import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { isAcademyMember } from "@/lib/discord";
import { ensureStudent } from "@/services/students";

declare module "next-auth" {
  interface Session {
    /** HMAC-SHA256 ダイジェスト。生の Discord ID はセッションに載せない */
    discordHash: string;
    studentId: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    discordHash?: string;
    studentId?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Discord({
      // メールアドレスは要求しない
      authorization: { params: { scope: "identify guilds" } },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
    error: "/error",
  },
  callbacks: {
    /**
     * 所属確認と学籍の発行を行う。
     * 未参加者を /join へ送るため、jwt ではなくここで判定する
     * （jwt コールバックの例外は Auth.js が一律のエラーコードに丸めてしまう）。
     */
    async signIn({ account, profile }) {
      if (account?.provider !== "discord" || !account.access_token) return false;

      if (!(await isAcademyMember(account.access_token))) return "/join";

      const discordId = account.providerAccountId ?? (profile?.id as string | undefined);
      if (!discordId) return false;

      await ensureStudent(discordId);

      return true;
    },

    /**
     * 初回サインイン時にだけ生の Discord ID に触れる。
     * signIn で発行済みのため、ここでの ensureStudent は既存レコードの読み出しに落ちる。
     * トークンに残すのはダイジェストと学籍番号だけで、
     * 既定で sub に入る Discord ID とプロフィール情報は捨てる。
     */
    async jwt({ token, account, profile }) {
      if (account) {
        const discordId = account.providerAccountId ?? (profile?.id as string | undefined);
        if (!discordId) throw new Error("Discord ID を取得できませんでした。");

        const student = await ensureStudent(discordId);

        token.discordHash = student.discordHash;
        token.studentId = student.studentId;
        token.sub = student.discordHash;
        delete token.name;
        delete token.email;
        delete token.picture;
      }
      return token;
    },

    async session({ session, token }) {
      session.discordHash = token.discordHash ?? "";
      session.studentId = token.studentId ?? "";
      return session;
    },
  },
});
