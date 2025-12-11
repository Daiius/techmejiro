import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "../better-auth.config";

export const app = new Hono();

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
  logger(),
);

const route = app
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .all("/api/auth/*", async (c) => {
    const res = await auth.handler(c.req.raw);
    return res;
  });

export type AppType = typeof route;
