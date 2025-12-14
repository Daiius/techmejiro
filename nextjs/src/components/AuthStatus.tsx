import { getUser } from "@/lib/user";
import { SignOutButton } from "./SignOutButton";
import { SignInButton } from "./SignInButton";

export const AuthStatus = async () => {
  "use cache: private";
  const user = await getUser();
  return user == null ? <SignInButton /> : <SignOutButton />;
};
