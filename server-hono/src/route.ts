import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./better-auth.config";
import {
  getImpressions,
  getTechs,
  getVotesByUserId,
  updateVotesByUserId,
} from "./lib";
import { loginRequired } from "./middlewares";
import { zValidator as zv } from "@hono/zod-validator";
import { z } from "zod/v4";

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
  })
  .patch(
    "/votes",
    loginRequired,
    zv("json", z.record(z.string(), z.string())),
    async (c) => {
      const user = c.get("user");
      const votes = c.req.valid("json");
      await updateVotesByUserId(user.id, votes);

      return c.body(null, 200);
    },
  );

export type AppType = typeof route;
