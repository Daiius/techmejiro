import { cookies } from "next/headers";
import type { Result, User, AppError } from "@/types";
import { honoClientForServer as honoClient } from "@/lib/honoClient";
import { fromHonoResponse } from "@/lib/result";

export const getUser = async (): Promise<Result<User, AppError>> => {
  const cookieHeader = await cookies();
  const res = await honoClient.me.$get(undefined, {
    headers: {
      cookie: cookieHeader.toString(),
    },
  });
  return fromHonoResponse(res);
};
