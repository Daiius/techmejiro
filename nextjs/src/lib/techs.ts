import { honoClientForServer as honoClient } from "@/lib/honoClient";

export const getTechs = async () => {
  const res = await honoClient.techs.$get();
  if (!res.ok) {
    return [];
  }
  const techs = await res.json();
  return techs;
};
