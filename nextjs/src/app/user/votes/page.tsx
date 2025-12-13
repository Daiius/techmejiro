import { redirect } from "next/navigation";
import { getUser } from "@/lib/user";
import { getTechs } from "@/lib/techs";
import { getVotes } from "@/lib/votes";
import { getImpressions } from "@/lib/impressions";

export default async function VotesPage() {
  "use cache: private";
  const user = await getUser();
  if (!user) {
    return redirect(`/signin?next=${encodeURIComponent("/user/votes")}`);
  }
  const techs = await getTechs();
  const impressions = await getImpressions();
  const votes = await getVotes();
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">あなたの投票内容：</h2>
      <form>
        <ul className="list">
          {techs.map((tech) => (
            <li key={tech.key} className="list-row">
              <div>
                <span className="text-xl">{tech.name}</span>
                <div className="flex gap-2">
                  {tech.tags.map((tag) => (
                    <span
                      key={tag.key}
                      className="badge badge-outline badge-info text-xs"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="ml-auto flex gap-8">
                {[
                  { key: "unfamiliar", name: "あまり目にしない" },
                  ...impressions,
                ].map((impression) => (
                  <label
                    key={impression.key}
                    className="flex items-center gap-2 cursor-pointer label"
                  >
                    <input
                      type="radio"
                      className="radio"
                      defaultChecked={impression.key === "unfamiliar"}
                      name={`impression-tech-${tech.key}`}
                      value={impression.key}
                    />
                    <span>{impression.name}</span>
                  </label>
                ))}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <button type="submit" className="btn btn-primary">
            投票する
          </button>
        </div>
      </form>
    </div>
  );
}
