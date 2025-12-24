"use client";

import { useVotesForm } from "@/hooks/useVotesForm";
import type { Vote, Tech, Impression } from "@/types";
import { CheckIcon } from "./icons/CheckIcon";
import { TechListItem } from "./TechListItem";

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
  const { votes, handleOnChange, completed, sending } = useVotesForm({
    initialVotes,
  });
  return (
    <form>
      <ul className="list">
        {techs.map((tech) => (
          /*
          <li key={tech.key} className="list-row items-center">
            <div className="flex flex-wrap gap-2">
              <span className="text-xl">{tech.name}</span>
            </div>
            */
          <TechListItem key={tech.key} techName={tech.name}>
            <div className="flex flex-wrap gap-2">
              {tech.tags.map((tag) => (
                <span
                  key={tag.key}
                  className="badge badge-outline badge-info text-xs text-nowrap"
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="flex flex-col lg:flex-row gap-2 lg:gap-8">
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
                    checked={
                      votes[tech.key] === impression.key ||
                      (!(tech.key in votes) && impression.key === "unfamiliar")
                    }
                    name={`impression-tech-${tech.key}`}
                    value={impression.key}
                    onChange={async (e) => {
                      if (e.target.checked) {
                        await handleOnChange(tech.key, impression.key);
                      }
                    }}
                  />
                  <span className="text-lg">{impression.name}</span>
                </label>
              ))}
            </div>
            <div className="min-w-6">
              {sending.includes(tech.key) ? (
                <span className="loading loading-spinner size-6 text-base-content/50" />
              ) : completed.includes(tech.key) ? (
                <CheckIcon className="size-6 text-success" />
              ) : null}
            </div>
          </TechListItem>
        ))}
      </ul>
    </form>
  );
};
