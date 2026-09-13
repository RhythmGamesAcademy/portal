import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "学務ポータル | 音楽ゲーム学園",
    template: "%s | 音楽ゲーム学園 学務ポータル",
  },
  description: "音楽ゲーム学園の学務ポータル。学籍番号の発行と確認を行います。",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="flex min-h-dvh flex-col">
        <header className="border-b border-line">
          <div className="mx-auto w-full max-w-2xl px-5 py-4">
            <Link
              href="/"
              className="font-serif text-sm tracking-wide text-muted transition-colors hover:text-ink"
            >
              音楽ゲーム学園　学務ポータル
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10 sm:py-14">{children}</main>

        <footer className="border-t border-line">
          <div className="mx-auto w-full max-w-2xl px-5 py-6 text-xs leading-relaxed text-muted">
            音楽ゲーム学園 教務課
          </div>
        </footer>
      </body>
    </html>
  );
}
