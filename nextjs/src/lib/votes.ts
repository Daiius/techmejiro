import { headers } from "next/headers";
import { honoClient } from "@/lib/honoClient";

export const getVotes = async () => {
  const cookieHeaders = await headers();
  const res = await honoClient.votes.$get(undefined, {
    headers: {
      cookie: cookieHeaders.toString(),
    },
  });
  if (!res.ok) {
    return [];
  }
  return await res.json();
};
