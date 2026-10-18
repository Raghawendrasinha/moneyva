import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase();

  // Apply admin-only routing exclusively to the admin subdomain.
  if (hostname !== "admin.moneyva.in") {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;

  // Allow the existing admin dashboard and its authenticated API routes.
  if (
    pathname === "/admin" ||
    pathname.startsWith("/api/admin/")
  ) {
    return NextResponse.next();
  }

  // Make the admin subdomain's homepage display the existing admin page.
  if (pathname === "/") {
    return NextResponse.rewrite(new URL("/admin", request.url));
  }

  // Do not expose public pages through the admin hostname.
  return new NextResponse("Not Found", {
    status: 404,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
