import Link from "next/link";

import { getUser } from "@/lib/user";
import { SignOutButton } from "./SignOutButton";

export const AuthStatus = async () => {
  "use cache: private";
  const user = await getUser();
  return user == null ? (
    <Link className="btn btn-primary" href="/signin">
      サインイン...
    </Link>
  ) : (
    <SignOutButton />
  );
};
