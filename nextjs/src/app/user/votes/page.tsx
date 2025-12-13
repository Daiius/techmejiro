import { redirect } from "next/navigation";
import { getUser } from "@/lib/user";

export default async function VotesPage() {
  const user = await getUser();
  if (!user) {
    return redirect(`/signin?next=${encodeURIComponent("/user/votes")}`);
  }
  return (
    <div>
      <h2>あなたの投票内容：</h2>
    </div>
  );
}
