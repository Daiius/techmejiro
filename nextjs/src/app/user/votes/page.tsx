import { Suspense } from "react";
import { VotesForm } from "@/components/VotesForm";

export default async function VotesPage() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">あなたの投票内容：</h2>
      <Suspense>
        <VotesForm />
      </Suspense>
    </div>
  );
}
