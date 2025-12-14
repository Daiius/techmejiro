import { Suspense } from "react";

import { MejiroOshi } from "@/components/MejiroOshi";
import { TechList } from "@/components/TechList";

export default async function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-base-100 p-4">
      <MejiroOshi count={10} />
      <Suspense>
        <TechList />
      </Suspense>
    </main>
  );
}
