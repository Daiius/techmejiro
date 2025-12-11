"use client";

import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient({
  baseURL: "http://localhost:4000",
  basePath: "/api/auth",
});

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
