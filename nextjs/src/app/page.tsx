import { cookies } from "next/headers";
import type { AppType } from "server-hono";
import { hc } from "hono/client";

import { SignInButton } from "@/components/SignInButton";
import { SignOutButton } from "@/components/SignOutButton";

const client = hc<AppType>("http://techmejiro-server-hono:4000");

export default async function Home() {
  const cookieHeader = await cookies();
  const meResponse = await client.me.$get(undefined, {
    headers: {
      cookie: cookieHeader.toString(),
    },
  });
  if (!meResponse.ok) {
    return <div>??</div>;
  }

  const { user } = await meResponse.json();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {user != null ? (
          <div className="flex flex-col items-start">
            <span>Hello, {user.name}!!</span>
            <SignOutButton />
          </div>
        ) : (
          <SignInButton />
        )}
      </main>
    </div>
  );
}
