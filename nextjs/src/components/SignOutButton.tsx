"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";

export const SignOutButton = () => {
  const router = useRouter();
  return (
    <button
      className="btn btn-outlie btn-primary"
      onClick={async () => {
        await authClient.signOut();
        router.refresh();
      }}
    >
      サインアウト
    </button>
  );
};
