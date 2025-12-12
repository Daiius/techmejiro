import type { MiddlewareHandler } from "hono";
import { auth } from "./better-auth.config";

import type { Variables } from "./types";

export const loginRequired: MiddlewareHandler<{
  Variables: Variables;
}> = async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.body(null, 401);
  }

  c.set("user", session.user);

  await next();
};
