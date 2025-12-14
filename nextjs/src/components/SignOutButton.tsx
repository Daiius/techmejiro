"use client";

import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/authClient";

export const SignOutButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <button
      className="btn btn-outlie btn-primary"
      onClick={async () => {
        await authClient.signOut();
        // NOTE ルートにいるときにrouter.push() しても画面が更新されない
        //      だからと言って route.refresh() に任せると /signin に行ってしまう
        // TODO この辺りのベストプラクティス調査
        pathname === "/" ? router.refresh() : router.push("/");
      }}
    >
      サインアウト
    </button>
  );
};
