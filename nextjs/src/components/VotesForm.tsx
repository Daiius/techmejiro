import { getTechs } from "@/lib/techs";
import { getVotes } from "@/lib/votes";
import { getImpressions } from "@/lib/impressions";

import { VotesFormClient } from "@/components/VotesFormClient";

export const VotesForm = async () => {
  const techs = await getTechs();
  const impressions = await getImpressions();
  const votes = await getVotes();

  console.log("votes: ", votes);

  return (
    <VotesFormClient techs={techs} impressions={impressions} votes={votes} />
  );
};
