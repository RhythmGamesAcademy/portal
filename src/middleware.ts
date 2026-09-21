import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, localeCookie, localeFromAcceptLanguage } from "@/i18n/config";

export function middleware(request: NextRequest) {
  const pathnameLocale = request.nextUrl.pathname.split("/")[1];
  const legacyPaths = new Set(["id", "join", "error", "api"]);
  if (pathnameLocale && /^[a-z]{2}$/i.test(pathnameLocale) && !isLocale(pathnameLocale) && !legacyPaths.has(pathnameLocale)) {
    const fallback = request.nextUrl.clone();
    const rest = request.nextUrl.pathname.split("/").slice(2).join("/");
    fallback.pathname = `/ja${rest ? `/${rest}` : ""}`;
    return NextResponse.redirect(fallback);
  }
  const cookieLocale = request.cookies.get(localeCookie)?.value;
  const locale = isLocale(pathnameLocale)
    ? pathnameLocale
    : isLocale(cookieLocale)
      ? cookieLocale
      : localeFromAcceptLanguage(request.headers.get("accept-language"));
  const headers = new Headers(request.headers);
  headers.set("x-locale", locale || defaultLocale);
  const response = NextResponse.next({ request: { headers } });
  if (isLocale(pathnameLocale)) {
    response.cookies.set(localeCookie, pathnameLocale, { path: "/", maxAge: 31536000, sameSite: "lax" });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|icon|favicon.ico).*)"],
};
