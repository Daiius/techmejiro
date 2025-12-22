import { NextRequest, NextResponse } from "next/server";

// 開発環境では __Host- プレフィックスは使えない（secure: true が必須のため）
const POST_LOGIN_REDIRECT_COOKIE =
  process.env.NODE_ENV === "production"
    ? "__Host-post-signin-redirect"
    : "post-signin-redirect";

// このWebアプリケーションで許可されるログイン後のリダイレクト先
const allowedRedirectTargets = ["/votes", "/analysis"] as const;

function sanitizeNext(raw: string | null): string {
  if (!raw) return "/";
  const v = raw.trim().replace(/[\u0000-\u001F\u007F]/g, "");
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(v)) return "/";
  if (v.startsWith("//")) return "/";
  if (v.includes("\\")) return "/";
  if (!v.startsWith("/")) return "/";

  console.log("redirect target: ", v)
  // ループ防止（必要に応じて）
  if (v.startsWith("/signin") || v.startsWith("/auth/")) return "/";

  // リダイレクト候補は限定される（/user 以下）のでそれ以外を指定されたら / にしておく
  if (v !== "/votes" && v !== "/analysis") return "/";

  return v;
}

export function GET(req: NextRequest) {
  const next = sanitizeNext(req.nextUrl.searchParams.get("next"));
  console.log("next redirect path: ", next)

  // next を URL から消して /signin に戻す（任意）
  const res = NextResponse.redirect(new URL("/signin", req.nextUrl.origin));

  res.cookies.set({
    name: POST_LOGIN_REDIRECT_COOKIE,
    value: next,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 5,
  });

  return res;
}
