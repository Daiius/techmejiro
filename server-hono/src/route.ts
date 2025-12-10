import { Hono } from "hono";
import { auth } from "../better-auth.config";

export const app = new Hono();

const route = app
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .all("/api/auth/*", async (c) => {
    const res = await auth.handler(c.req.raw);
    return new Response(res.body, { ...res });
  });

export type AppType = typeof route;
