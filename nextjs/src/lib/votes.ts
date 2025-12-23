"use server";

import { cookies } from "next/headers";
import type { Result, Vote, AppError } from "@/types";
import { honoClientForServer as honoClient } from "@/lib/honoClient";
import { fromHonoResponse } from "@/lib/result";

export const getVotes = async (): Promise<Result<Vote[], AppError>> => {
  const cookieHeader = await cookies();
  const res = await honoClient.votes.$get(undefined, {
    headers: {
      cookie: cookieHeader.toString(),
    },
  });
  return fromHonoResponse(res);
};

export const updateVotes = async (newVotes: Record<string, string>): Promise<Result<void, AppError>> => {
  const cookieHeader = await cookies();
  const res = await honoClient.votes.$patch(
    { json: newVotes },
    {
      headers: {
        cookie: cookieHeader.toString(),
      },
    },
  );

  return fromHonoResponse<void>(res);
};
