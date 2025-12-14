import { honoClientForServer as honoClient } from "@/lib/honoClient";

export const getImpressions = async () => {
  const res = await honoClient.impressions.$get();
  if (!res.ok) {
    return [];
  }

  return await res.json();
};
