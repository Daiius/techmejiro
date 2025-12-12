import { Suspense } from "react";

import { SignInSection } from "@/components/SignInSection";
import { MejiroOshi } from "@/components/MejiroOshi";

export default async function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-base-100 p-4">
      <MejiroOshi count={10} />
      <Suspense>
        <SignInSection />
      </Suspense>
    </main>
  );
}
