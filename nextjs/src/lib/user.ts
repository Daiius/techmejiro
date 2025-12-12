import { cookies } from "next/headers";
import { honoClient } from "@/lib/honoClient";

export const getUser = async () => {
  const cookieHeader = await cookies();
  const res = await honoClient.me.$get(undefined, {
    headers: {
      cookie: cookieHeader.toString(),
    },
  });
  if (!res.ok) {
    return null;
  }
  const { user } = await res.json();

  return user;
};
