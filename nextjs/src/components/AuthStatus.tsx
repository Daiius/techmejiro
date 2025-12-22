import { getUser } from "@/lib/user";
import { SignOutButton } from "./SignOutButton";

export const AuthStatus = async () => {
  const userResult = await getUser();
  return userResult.success && <SignOutButton />;
};
