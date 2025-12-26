import { Suspense } from "react";
import { VotesForm } from "@/components/VotesForm";

import Link from "next/link";

export default async function VotesPage() {
  return (
    <div className="flex flex-col px-4 py-12 gap-4">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">あなたの投票内容：</h2>
        <Suspense>
          <VotesForm />
        </Suspense>
      </div>
      <Link href="/" className="btn btn-primary btn-lg self-center">
        トップに戻る
      </Link>
    </div>
  );
}
