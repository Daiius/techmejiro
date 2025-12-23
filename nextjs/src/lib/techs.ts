import type { Result, Tech, AppError } from "@/types";
import { honoClientForServer as honoClient } from "@/lib/honoClient";
import { fromHonoResponse } from "@/lib/result";

export const getTechs = async (): Promise<Result<Tech[], AppError>> => {
  const res = await honoClient.techs.$get();
  return fromHonoResponse(res);
};
