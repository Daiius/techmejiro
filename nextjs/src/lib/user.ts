import { cookies } from "next/headers";
import { honoClient } from "@/lib/honoClient";

export const getUser = async () => {
  const cookieHeader = await cookies();
  const meResponse = await honoClient.me.$get(undefined, {
    headers: {
      cookie: cookieHeader.toString(),
    },
  });
  if (!meResponse.ok) {
    return null;
  }
  const { user } = await meResponse.json();

  return user;
};
