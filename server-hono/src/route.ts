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
  })
  .get("/me", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      return c.json({ user: null });
    }

    const { id, name, email } = session.user;
    return c.json({ user: { id, name, email } });
  });

export type AppType = typeof route;
