import createMiddleware from "next-intl/middleware";
import {routing} from "./src/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip next-intl for static HTML under /prusafinance (public/prusafinance/*) and asset paths with extensions
  matcher: ["/((?!api|trpc|_next|_vercel|prusafinance|.*\\..*).*)"],
};

