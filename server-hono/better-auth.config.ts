import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "db";

export const auth = betterAuth({
  appName: "techmejiro",
  baseURL: "http://localhost:4000",
  database: drizzleAdapter(db, { provider: "mysql" }),
  trustedOrigins: ["http://localhost:3000"],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  //advanced: {
  //  crossSubDomainCookies: {
  //    enabled: true,
  //    domain: ".localhost",
  //  },
  //},
  logger: {
    level: "debug",
    disabled: false,
  },
});
