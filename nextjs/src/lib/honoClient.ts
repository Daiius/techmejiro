import type { AppType } from "server-hono";
import { hc } from "hono/client";

export const honoClientForServer = hc<AppType>(process.env.API_URL!);
//export const honoClientForClient = hc<AppType>(
//  process.env.NEXT_PUBLIC_API_URL!,
//  {
//    fetch: (input: RequestInfo | URL, init?: RequestInit) => {
//      return fetch(input, {
//        ...init,
//        credentials: "include",
//      });
//    },
//  },
//);
