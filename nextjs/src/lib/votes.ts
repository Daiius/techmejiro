"use server";

import { cookies } from "next/headers";
import { honoClientForServer as honoClient } from "@/lib/honoClient";
import { fromHonoResponse } from "@/lib/result";

export const getVotes = async () => {
  const cookieHeader = await cookies();
  const res = await honoClient.votes.$get(undefined, {
    headers: {
      cookie: cookieHeader.toString(),
    },
  });
  return fromHonoResponse(res);
};

export const updateVotes = async (newVotes: Record<string, string>) => {
  console.log("newVotes: ", newVotes);
  const cookieHeader = await cookies();
  const res = await honoClient.votes.$patch(
    { json: newVotes },
    {
      headers: {
        cookie: cookieHeader.toString(),
      },
    },
  );
  return fromHonoResponse(res);
};
