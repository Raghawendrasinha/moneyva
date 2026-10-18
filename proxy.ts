import { NextRequest, NextResponse } from "next/server";

function brandedNotFound(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/__moneyva_not_found";
  url.search = "";
  return NextResponse.rewrite(url);
}

export function proxy(request: NextRequest) {
  const hostname = request.nextUrl.hostname.toLowerCase();
  const pathname = request.nextUrl.pathname;

  // Allow the internal destination used to render the branded 404 page.
  if (pathname === "/__moneyva_not_found") {
    return NextResponse.next();
  }

  // Hide admin pages on public hostnames.
  if (hostname === "moneyva.in" || hostname === "www.moneyva.in") {
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      return brandedNotFound(request);
    }

    return NextResponse.next();
  }

  // Apply admin-only routing to the admin subdomain.
  if (hostname !== "admin.moneyva.in") {
    return NextResponse.next();
  }

  // Only the dashboard and its API routes are available here.
  if (pathname === "/admin" || pathname.startsWith("/api/admin/")) {
    return NextResponse.next();
  }

  // The subdomain homepage displays the existing admin page.
  if (pathname === "/") {
    return NextResponse.rewrite(new URL("/admin", request.url));
  }

  // All other paths show the branded 404 page.
  return brandedNotFound(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
