import createMiddleware from "next-intl/middleware";
import {type NextRequest, NextResponse} from "next/server";
import {routing} from "./src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const PRUSAFINANCE_HOSTS = new Set(["prusafinance.com", "www.prusafinance.com"]);

function prusafinanceStaticPath(pathname: string): string | null {
  if (pathname === "/" || pathname === "") {
    return "/prusafinance/index.html";
  }
  if (pathname === "/dekujeme" || pathname === "/dekujeme/") {
    return "/prusafinance/dekujeme.html";
  }
  if (pathname.startsWith("/prusafinance")) {
    return null;
  }
  return `/prusafinance${pathname}`;
}

function handlePrusafinanceHost(request: NextRequest): NextResponse {
  const {pathname} = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const target = prusafinanceStaticPath(pathname);
  if (target === null) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = target;
  return NextResponse.rewrite(url);
}

export default function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";
  if (PRUSAFINANCE_HOSTS.has(host)) {
    return handlePrusafinanceHost(request);
  }
  return intlMiddleware(request);
}

export const config = {
  // Skip next-intl for static HTML under /prusafinance (public/prusafinance/*) and asset paths with extensions
  matcher: ["/((?!api|trpc|_next|_vercel|prusafinance|.*\\..*).*)"],
};
