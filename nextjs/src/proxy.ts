import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 *
 */
export default async function proxy(req: NextRequest) {
  const sessionMayExist = !!req.cookies.get("better-auth.session_token");

  if (req.nextUrl.pathname !== "/signin" && !sessionMayExist) {
    // 元のURLを保存するために /auth/prepare にリダイレクト
    const next = req.nextUrl.pathname + req.nextUrl.search;
    const prepareUrl = new URL("/auth/prepare", req.url);
    prepareUrl.searchParams.set("next", next);
    return NextResponse.redirect(prepareUrl);
  }

  // if already logged in user is going to login name, redirect to user page
  //if (req.nextUrl.pathname === "/signin") {
  //  return NextResponse.redirect(`${process.env.HOST_URL}/user/votes`);
  //}

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*"],
};
