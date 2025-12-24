import { honoClientForServer as honoClient } from "@/lib/honoClient";
import { fromHonoResponse } from "@/lib/result";

export const getImpressions = async () => {
  const res = await honoClient.impressions.$get();
  return fromHonoResponse(res);
};
