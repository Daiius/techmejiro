import { honoClientForServer as honoClient } from "@/lib/honoClient";
import { fromHonoResponse } from "@/lib/result";

export const getAnalysisBySingleTech = async (techKey: string) => {
  const res = await honoClient.analysis.single[":techKey"].$get({ param: { techKey } });
  return fromHonoResponse(res);
}
