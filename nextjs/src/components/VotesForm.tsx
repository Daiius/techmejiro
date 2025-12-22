import { getTechs } from "@/lib/techs";
import { getVotes } from "@/lib/votes";
import { getImpressions } from "@/lib/impressions";

import { VotesFormClient } from "@/components/VotesFormClient";

export const VotesForm = async () => {
  const techsResult = await getTechs();
  const impressionsResult = await getImpressions();
  const votesResult = await getVotes();

  if (!techsResult.success) {
    return (
      <div className="alert alert-error">
        <span>技術データの取得に失敗しました: {techsResult.error.message}</span>
      </div>
    );
  }

  if (!impressionsResult.success) {
    return (
      <div className="alert alert-error">
        <span>印象データの取得に失敗しました: {impressionsResult.error.message}</span>
      </div>
    );
  }

  if (!votesResult.success) {
    return (
      <div className="alert alert-error">
        <span>投票データの取得に失敗しました: {votesResult.error.message}</span>
      </div>
    );
  }

  const techs = techsResult.data;
  const impressions = impressionsResult.data;
  const votes = votesResult.data;

  console.log("votes: ", votes);

  return (
    <VotesFormClient techs={techs} impressions={impressions} votes={votes} />
  );
};
