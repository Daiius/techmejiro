import type { AppType } from "server-hono";
import { hc } from "hono/client";

export const honoClient = hc<AppType>("http://techmejiro-server-hono:4000");
