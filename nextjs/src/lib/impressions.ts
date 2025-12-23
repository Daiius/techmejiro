import type { Result, Impression, AppError } from "@/types";
import { honoClientForServer as honoClient } from "@/lib/honoClient";
import { fromHonoResponse } from "@/lib/result";

export const getImpressions = async (): Promise<Result<Impression[], AppError>> => {
  const res = await honoClient.impressions.$get();
  return fromHonoResponse(res);
};
