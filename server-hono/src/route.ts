import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./better-auth.config";
import { getImpressions, getTechs, getVotesByUserId } from "./lib";
import { loginRequired } from "./middlewares";

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
  .get("/me", loginRequired, async (c) => {
    const { id, name, email } = c.get("user");
    return c.json({ user: { id, name, email } });
  })
  .get("/techs", async (c) => {
    const techs = await getTechs();
    c.header(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate=3600",
    );
    return c.json(techs);
  })
  .get("/impressions", async (c) => {
    const impressions = await getImpressions();
    c.header(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate=3600",
    );
    return c.json(impressions);
  })
  .get("/votes", loginRequired, async (c) => {
    const user = c.get("user");
    const votes = await getVotesByUserId(user.id);
    return c.json(votes);
  });

export type AppType = typeof route;
