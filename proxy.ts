import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  // Strip the port (e.g. "admin.lvh.me:3000" -> "admin.lvh.me")
  const host = hostname.split(":")[0];
  const subdomain = host.split(".")[0];

  const isAdminSubdomain = subdomain === "admin";

  if (isAdminSubdomain && !url.pathname.startsWith("/admin")) {
    url.pathname = `/admin${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};