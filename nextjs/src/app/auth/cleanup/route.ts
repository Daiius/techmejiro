import { NextResponse } from "next/server";

/**
 * 例:
 * - セッションcookie名: techmejiro.session_token
 * - post-signin redirect cookie名:
 *   - 本番: __Host-post-signin-redirect
 *   - 開発: post-signin-redirect
 *
 * ※ __Host- プレフィックスを使う場合:
 *   - Secure 必須（HTTPSが必要）
 *   - Domain を付けない
 *   - Path は "/" 必須
 */
const SESSION_COOKIE_NAMES = [
  "techmejiro.session_token",
  // もし refresh / csrf / state 等が別cookieならここに追加
  // "techmejiro.refresh",
  // "techmejiro.csrf",
];

// 開発環境では __Host- プレフィックスは使えない（secure: true が必須のため）
const POST_LOGIN_REDIRECT_COOKIE =
  process.env.NODE_ENV === "production"
    ? "__Host-post-signin-redirect"
    : "post-signin-redirect";


export function GET(req: Request) {
  const url = new URL(req.url);

  // signin へ redirect（origin は同一サイトに固定される）
  const res = NextResponse.redirect(new URL("/", url.origin));

  // 1) セッションcookieを削除（発行時と同じ属性で expire するのが重要）
  //    ※ Domain を付けて発行しているなら、ここでも domain を付けて消す必要があります。
  for (const name of SESSION_COOKIE_NAMES) {
    res.cookies.set({
      name,
      value: "",
      expires: new Date(0),
      path: "/",
      httpOnly: process.env.NODE_ENV === "production",
      sameSite: "lax",
      secure: true,
      // domain: ".example.com", // ←発行時に Domain を付けてるなら合わせる
    });
  }

  // 2) ログイン後の戻り先を HttpOnly cookie に保存（短命・使い捨て想定）
  res.cookies.set({
    name: POST_LOGIN_REDIRECT_COOKIE,
    value: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 5, // 5分
    // domain: ".example.com", // __Host- を使うなら domain は付けない
  });

  return res;
}
