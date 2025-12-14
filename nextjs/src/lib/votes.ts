import { cookies } from "next/headers";
import { honoClientForServer as honoClient } from "@/lib/honoClient";

export const getVotes = async () => {
  const cookieHeader = await cookies();
  const res = await honoClient.votes.$get(undefined, {
    headers: {
      cookie: cookieHeader.toString(),
    },
  });
  if (!res.ok) {
    return [];
  }
  return await res.json();
};

export const updateVotes = async (newVotes: Record<string, string>) => {
  const cookieHeader = await cookies();
  await honoClient.votes.$patch(
    { json: newVotes },
    {
      headers: {
        cookie: cookieHeader.toString(),
      },
    },
  );
};
