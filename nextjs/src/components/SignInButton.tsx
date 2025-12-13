"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const SignInButton = () => {
  const pathname = usePathname();
  return (
    <>
      {pathname !== "/signin" && (
        <Link className="btn btn-primary" href="/signin">
          サインイン...
        </Link>
      )}
    </>
  );
};
