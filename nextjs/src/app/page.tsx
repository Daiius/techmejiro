import { Suspense } from "react";

import Link from "next/link";

import { MejiroOshi } from "@/components/MejiroOshi";
import { TechList } from "@/components/TechList";

export default async function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-base-100 p-4">
      <MejiroOshi count={10} />
      <Link href="/votes" className="btn btn-primary">
        投票
      </Link>
      <Suspense>
        <TechList />
      </Suspense>
    </main>
  );
}
