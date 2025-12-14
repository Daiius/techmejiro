"use client";

import { clsx } from "clsx";
import { useEffect, useState } from "react";

import { Roboto } from "next/font/google";

import { authClient } from "@/lib/authClient";
import { setLastLoginMethod, getLastLoginMethod } from "@/lib/loginMethods";

import { GitHubIcon } from "./icons/GitHubIcon";

const roboto = Roboto({ weight: "500" });

export const SignInWithGitHubButton = () => {
  const [isLastUsed, setIsLastUsed] = useState(false);
  useEffect(() => {
    setIsLastUsed(getLastLoginMethod() === "github");
  }, []);
  return (
    <div className="flex items-center gap-2">
      <button
        className="btn bg-white flex items-center gap-[10px] w-[183px] h-[40px] px-[6px] text-[#1f1f1f]"
        onClick={async () => {
          try {
            await authClient.signIn.social({
              provider: "github",
              callbackURL: "http://localhost:3000/auth/after-signin",
            });
            setLastLoginMethod("github");
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <GitHubIcon className="size-5" />
        <span className={clsx(roboto.className)}>Sign in with GitHub</span>
      </button>
      {isLastUsed && (
        <div className="badge badge-info text-xs flex self-center justify-self-center">
          lastly used
        </div>
      )}
    </div>
  );
};
