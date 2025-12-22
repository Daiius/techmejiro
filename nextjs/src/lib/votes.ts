"use server";

import { cookies } from "next/headers";
import type { Result, Vote, Error } from "@/types";
import { honoClientForServer as honoClient } from "@/lib/honoClient";
import { fromHonoResponse } from "@/lib/result";

export const getVotes = async (): Promise<Result<Vote[], Error>> => {
  const cookieHeader = await cookies();
  const res = await honoClient.votes.$get(undefined, {
    headers: {
      cookie: cookieHeader.toString(),
    },
  });
  return fromHonoResponse<Vote[]>(res);
};

export const updateVotes = async (newVotes: Record<string, string>): Promise<Result<void, Error>> => {
  const cookieHeader = await cookies();
  const res = await honoClient.votes.$patch(
    { json: newVotes },
    {
      headers: {
        cookie: cookieHeader.toString(),
      },
    },
  );

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      return {
        success: false,
        error: { type: "Unauthorized", message: "認証が必要です" }
      };
    }
    return {
      success: false,
      error: {
        type: "NetworkError",
        message: `Request failed: ${res.statusText}`,
        status: res.status
      }
    };
  }

  return { success: true, data: undefined };
};
