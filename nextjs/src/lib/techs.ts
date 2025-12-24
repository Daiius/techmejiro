import { honoClientForServer as honoClient } from "@/lib/honoClient";
import { fromHonoResponse } from "@/lib/result";

export const getTechs = async () => {
  const res = await honoClient.techs.$get();
  return fromHonoResponse(res);
};
