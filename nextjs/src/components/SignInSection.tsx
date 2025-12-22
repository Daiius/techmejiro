import { SignInWithGoogleButton } from "./SignInWithGoogleButton";
import { SignInWithGitHubButton } from "@/components/SignInWithGitHubButton";
import { SignOutButton } from "@/components/SignOutButton";

import { getUser } from "@/lib/user";

export const SignInSection = async () => {
  "use cache: private";
  const userResult = await getUser();
  return userResult.success ? (
    <div className="flex flex-col items-start">
      <span>Hello, {userResult.data.name}!!</span>
      <SignOutButton />
    </div>
  ) : (
    <div className="flex flex-col gap-4">
      <SignInWithGoogleButton />
      <SignInWithGitHubButton />
    </div>
  );
};
