"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { updateVotes } from "@/lib/votes";

import type { Vote } from "@/types";

export interface UseVotesFormArgs {
  initialVotes: Vote[];
}

type VoteState = { [techKey: string]: string };

export const useVotesForm = ({ initialVotes }: UseVotesFormArgs) => {
  const [votes, setVotes] = useState(
    Object.fromEntries(
      initialVotes.map((vote) => [vote.tech.key, vote.impression.key]),
    ),
  );
  const [updatedVotes, setUpdatedVotes] = useState<VoteState>({});
  const [completedVotes, setCompletedVotes] = useState<string[]>([]);
  const debouncedSubmitUpdatedVotes = useDebouncedCallback(
    async (votesToSubmit: { [techKey: string]: string }) => {
      const result = await updateVotes(votesToSubmit);
      if (result.success) {
        setUpdatedVotes({});
        setCompletedVotes([...completedVotes, ...Object.keys(votesToSubmit)]);
      } else {
        console.error("Failed to update votes:", result.error);
        // エラー処理: ユーザーに通知するなど
      }
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
    const newCompletedVotes = completedVotes.filter(
      (techKey) => techKey !== newTechKey,
    );
    setCompletedVotes(newCompletedVotes);

    await debouncedSubmitUpdatedVotes(newUpdatedVotes);
  };

  return {
    votes,
    handleOnChange,
    sending: Object.keys(updatedVotes),
    completed: completedVotes,
  };
};
