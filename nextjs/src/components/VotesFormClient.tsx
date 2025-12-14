"use client";

import { useState } from "react";

import type { getTechs } from "@/lib/techs";
import type { getVotes } from "@/lib/votes";
import type { getImpressions } from "@/lib/impressions";
import { useDebouncedCallback } from "use-debounce";

import { honoClientForClient as honoClient } from "@/lib/honoClient";

type ElementType<T> = T extends (infer U)[] ? U : never;
type Vote = ElementType<Awaited<ReturnType<typeof getVotes>>>;
type Impression = ElementType<Awaited<ReturnType<typeof getImpressions>>>;
type Tech = ElementType<Awaited<ReturnType<typeof getTechs>>>;

export interface VotesFormClientProps {
  techs: Tech[];
  votes: Vote[];
  impressions: Impression[];
}

export const VotesFormClient = ({
  techs,
  votes: initialVotes,
  impressions,
}: VotesFormClientProps) => {
  const [votes, setVotes] = useState(
    Object.fromEntries(
      initialVotes.map((vote) => [vote.tech.key, vote.impression.key]),
    ),
  );
  const [updatedVotes, setUpdatedVotes] = useState<{
    [techKey: string]: string;
  }>({});
  const debouncedSubmitUpdatedVotes = useDebouncedCallback(
    async (votesToSubmit: { [techKey: string]: string }) => {
      console.log("updating...: ", votesToSubmit);
      await honoClient.votes.$patch({ json: votesToSubmit });
      console.log("done!");
      setUpdatedVotes({});
    },
    3_000, // 3 seconds
  );
  const handleOnChange = async (
    newTechKey: string,
    newImpressionKey: string,
  ) => {
    // update local votes data
    const newVotes = Object.fromEntries([
      ...Object.entries(votes).filter(([techKey, _]) => techKey !== newTechKey),
      [newTechKey, newImpressionKey],
    ]);
    setVotes(newVotes);
    const newUpdatedVotes = Object.fromEntries([
      ...Object.entries(updatedVotes).filter(
        ([techKey, _]) => techKey !== newTechKey,
      ),
      [newTechKey, newImpressionKey],
    ]);
    setUpdatedVotes(newUpdatedVotes);

    await debouncedSubmitUpdatedVotes(newUpdatedVotes);
  };
  return (
    <form>
      <ul className="list">
        {techs.map((tech) => (
          <li key={tech.key} className="list-row items-center">
            <div className="flex flex-wrap gap-2">
              <span className="text-xl">{tech.name}</span>
              <div className="flex flex-wrap gap-1">
                {tech.tags.map((tag) => (
                  <span
                    key={tag.key}
                    className="badge badge-outline badge-info text-xs text-nowrap"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="ml-auto flex flex-col md:flex-row gap-2 md:gap-8">
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
                    checked={votes[tech.key] === impression.key}
                    name={`impression-tech-${tech.key}`}
                    value={impression.key}
                    onChange={async (e) => {
                      if (e.target.checked) {
                        await handleOnChange(tech.key, impression.key);
                      }
                    }}
                  />
                  <span>{impression.name}</span>
                </label>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </form>
  );
};
