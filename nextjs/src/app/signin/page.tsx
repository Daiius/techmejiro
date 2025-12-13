import { Suspense } from "react";
import { SignInSection } from "@/components/SignInSection";

export default async function SignInPage() {
  return (
    <Suspense>
      <SignInSection />
    </Suspense>
  );
}
