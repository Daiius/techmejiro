import { NextRequest, NextResponse } from "next/server";

const POST_LOGIN_REDIRECT_COOKIE = "__Host-post-login-redirect";

function sanitizeNext(raw: string | null): string {
  if (!raw) return "/";
  const v = raw.trim().replace(/[\u0000-\u001F\u007F]/g, "");
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(v)) return "/";
  if (v.startsWith("//")) return "/";
  if (v.includes("\\")) return "/";
  if (!v.startsWith("/")) return "/";
  if (v.startsWith("/signin") || v.startsWith("/auth/")) return "/";
  return v;
}

export async function GET(
  req: NextRequest,
  ctx: RouteContext<"/auth/start/[provider]">,
) {
  const { provider } = await ctx.params;

  const next = sanitizeNext(req.nextUrl.searchParams.get("next"));

  // 1) cookie 保存（短命・HttpOnly）
  const res = NextResponse.redirect(
    // 2) ここはあなたの認証開始URLに合わせる
    // 例: better-auth が /api/auth/signin/:provider を持つならそこへ
    new URL(
      `${process.env.API_URL_EXTERNAL}/auth/start/${provider}`,
      req.nextUrl.origin,
    ),
  );

  res.cookies.set({
    name: POST_LOGIN_REDIRECT_COOKIE,
    value: next,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 5,
  });

  return res;
}
