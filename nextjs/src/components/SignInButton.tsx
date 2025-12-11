"use client";

import { authClient } from "@/lib/authClient";

export const SignInButton = () => (
  <button
    className="btn btn-primary"
    onClick={async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:3000/",
      });
    }}
  >
    サインイン
  </button>
);
