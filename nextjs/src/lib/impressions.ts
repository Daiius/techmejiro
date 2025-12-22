import type { Result, Impression, Error } from "@/types";
import { honoClientForServer as honoClient } from "@/lib/honoClient";
import { fromHonoResponse } from "@/lib/result";

export const getImpressions = async (): Promise<Result<Impression[], Error>> => {
  const res = await honoClient.impressions.$get();
  return fromHonoResponse<Impression[]>(res);
};
