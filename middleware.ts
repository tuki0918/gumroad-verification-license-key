import { auth } from "@/utils/auth/auth";
import { i18n } from "@/utils/i18n/i18n-config";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  ...i18n,
  // default: always
  localePrefix: "as-needed",
});

// TODO: node_modules/next/dist/server/future/route-modules/app-route/module.d.ts
type AppRouteHandlerFnContext = {
  params?: Record<string, string | string[]>;
};

export const middleware = (
  req: NextRequest,
  event: AppRouteHandlerFnContext,
): NextResponse => {
  return auth(() => {
    return intlMiddleware(req);
  })(req, event) as NextResponse;
};

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    "/",
    "/(ja|en)/:path*",
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
