import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Noto_Sans_JP } from "next/font/google";
import { normalizeLocale } from "@/i18n/config";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "Rhythm Games Academy",
  description: "Rhythm Games Academy Student Portal",
  robots: { index: false, follow: false },
  icons: {
    icon: [{ url: "/icon/icon.png", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = normalizeLocale((await headers()).get("x-locale") ?? undefined);

  return (
    <html lang={locale} className={notoSansJP.variable}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
