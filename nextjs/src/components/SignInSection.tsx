import { SignInWithGoogleButton } from "./SignInWithGoogleButton";
import { SignInWithGitHubButton } from "@/components/SignInWithGitHubButton";
import { SignOutButton } from "@/components/SignOutButton";

import { getUser } from "@/lib/user";

export const SignInSection = async () => {
  "use cache: private";
  const user = await getUser();
  return user != null ? (
    <div className="flex flex-col items-start">
      <span>Hello, {user.name}!!</span>
      <SignOutButton />
    </div>
  ) : (
    <div className="flex flex-col gap-4">
      <SignInWithGoogleButton />
      <SignInWithGitHubButton />
    </div>
  );
};
