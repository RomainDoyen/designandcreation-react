import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  if (
    !process.env.SESSION_SECRET ||
    process.env.SESSION_SECRET.length < 32
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("e", "config");
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  const session = await getIronSession(request, response, sessionOptions);

  if (!session.admin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
