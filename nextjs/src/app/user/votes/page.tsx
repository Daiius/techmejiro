import { Suspense } from "react";

import { redirect } from "next/navigation";
import { getUser } from "@/lib/user";

import { VotesForm } from "@/components/VotesForm";

export default async function VotesPage() {
  const user = await getUser();
  if (!user) {
    return redirect(`/signin?next=${encodeURIComponent("/user/votes")}`);
  }
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">あなたの投票内容：</h2>
      <Suspense>
        <VotesForm />
      </Suspense>
    </div>
  );
}
