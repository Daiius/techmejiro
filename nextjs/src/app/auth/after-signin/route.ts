import { NextResponse } from "next/server";

// 開発環境では __Host- プレフィックスは使えない（secure: true が必須のため）
const POST_LOGIN_REDIRECT_COOKIE =
  process.env.NODE_ENV === "production"
    ? "__Host-post-signin-redirect"
    : "post-signin-redirect";

/** 内部遷移として安全な next に丸める */
function sanitizeNext(raw: string | null | undefined): string {
  if (!raw) return "/";

  const v = raw.trim().replace(/[\u0000-\u001F\u007F]/g, "");

  // スキーム付き（http:, javascript: など）を拒否
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(v)) return "/";
  // //evil.com 形式を拒否
  if (v.startsWith("//")) return "/";
  // バックスラッシュ拒否
  if (v.includes("\\")) return "/";
  // 内部パスのみ許可
  if (!v.startsWith("/")) return "/";

  // 念のため self-loop 防止
  if (
    v.startsWith("/signin") ||
    v.startsWith("/auth/cleanup") ||
    v.startsWith("/auth/after-signin")
  ) {
    return "/";
  }

  return v;
}

export function GET(req: Request) {
  const url = new URL(req.url);

  // 1) cookie から next を読む
  const cookieHeader = req.headers.get("cookie") ?? "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((v) => {
      const [k, ...rest] = v.trim().split("=");
      return [k, rest.join("=")];
    }),
  );

  console.log("[AFTER-SIGNIN] All cookies:", cookies);
  console.log("[AFTER-SIGNIN] Looking for:", POST_LOGIN_REDIRECT_COOKIE);

  const rawNext = cookies[POST_LOGIN_REDIRECT_COOKIE];
  console.log("[AFTER-SIGNIN] rawNext (encoded):", rawNext);

  // クッキーの値はURLエンコードされているのでデコード
  const decodedNext = rawNext ? decodeURIComponent(rawNext) : undefined;
  console.log("[AFTER-SIGNIN] decodedNext:", decodedNext);

  const next = sanitizeNext(decodedNext);
  console.log("[AFTER-SIGNIN] Redirecting to:", next);

  // 2) redirect 先を決定
  const res = NextResponse.redirect(new URL(next, url.origin));

  // 3) post-signin cookie を削除（ワンタイム）
  res.cookies.set({
    name: POST_LOGIN_REDIRECT_COOKIE,
    value: "",
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    // domain: ".example.com", // cleanup 側で付けたなら合わせる
  });

  return res;
}
