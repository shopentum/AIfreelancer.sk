import createMiddleware from "next-intl/middleware";
import {type NextRequest, NextResponse} from "next/server";
import {routing} from "./src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const PRUSAFINANCE_HOSTS = new Set(["prusafinance.com", "www.prusafinance.com"]);

export default function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";
  if (PRUSAFINANCE_HOSTS.has(host)) {
    return NextResponse.next();
  }
  return intlMiddleware(request);
}

export const config = {
  // Skip next-intl for static HTML under /prusafinance (public/prusafinance/*) and asset paths with extensions
  matcher: ["/((?!api|trpc|_next|_vercel|prusafinance|.*\\..*).*)"],
};
