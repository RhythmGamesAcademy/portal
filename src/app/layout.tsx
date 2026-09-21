import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Image from "next/image";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: {
    default: "学園ポータル | 音楽ゲーム学園",
    template: "%s | 音楽ゲーム学園 学園ポータル",
  },
  description: "音楽ゲーム学園の学園ポータル。Discord でログインして、学籍番号の発行と確認を行います。",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <body className="flex min-h-dvh flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-3 focus:text-accent-ink">
          本文へ移動
        </a>
        <header className="border-b border-line bg-surface">
          <div className="portal-container flex min-h-16 items-center py-2">
            <Link
              href="/"
              className="flex min-h-12 min-w-0 flex-wrap items-center gap-3 rounded-lg transition-colors hover:text-accent"
            >
              <Image src="/icon/rga-logo_w.svg" alt="" width={868} height={382} className="h-auto w-24 shrink-0 object-contain" priority />
              <span className="flex flex-col">
                <span className="text-base font-semibold">音楽ゲーム学園</span>
                <span className="text-sm text-muted">学園ポータル</span>
              </span>
            </Link>
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="portal-container flex-1 py-8 sm:py-10">{children}</main>

        <footer className="border-t border-line">
          <div className="portal-container flex flex-col gap-2 py-5 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted">音楽ゲーム学園</p>
            <nav aria-label="関連サイト" className="flex flex-wrap gap-x-5">
              <a href="https://rga-forms-portal.vercel.app" className="text-link">申請書作成ポータル</a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
