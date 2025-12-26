import {
  mysqlTable,
  varchar,
  bigint,
  uniqueIndex,
  unique,
  index,
  primaryKey,
} from "drizzle-orm/mysql-core";
import { user, account, session } from "./auth-schema";
import { defineRelations } from "drizzle-orm";

export const tags = mysqlTable(
  "Tags",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    key: varchar("key", { length: 32 }).notNull(),
    name: varchar("name", { length: 64 }).notNull(),
  },
  (table) => [unique("tags_key_idx").on(table.key)],
);

export const techs = mysqlTable(
  "Techs",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    key: varchar("key", { length: 32 }).notNull(),
    name: varchar("name", { length: 64 }).notNull(),
    url: varchar("url", { length: 256 }).notNull(),
  },
  (table) => [unique("techs_key_idx").on(table.key)],
);

export const techTags = mysqlTable(
  "TechTags",
  {
    techId: bigint("tech_id", { mode: "number" })
      .notNull()
      .references(() => techs.id),
    tagId: bigint("tag_id", { mode: "number" })
      .notNull()
      .references(() => tags.id),
  },
  (table) => [
    primaryKey({
      columns: [table.techId, table.tagId],
    }),
    index("tech_tags_tech_idx").on(table.techId),
    index("tech_tags_tag_idx").on(table.tagId),
  ],
);

export const impressions = mysqlTable(
  "Impressions",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey().notNull(),
    key: varchar("key", { length: 24 }).notNull(),
    name: varchar("name", { length: 32 }).notNull(),
  },
  (table) => [uniqueIndex("impressions_name_idx").on(table.name)],
);

export const votes = mysqlTable(
  "Votes",
  {
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => user.id),
    techId: bigint("tech_id", { mode: "number" })
      .notNull()
      .references(() => techs.id),
    impressionId: bigint("impression_id", { mode: "number" })
      .notNull()
      .references(() => impressions.id),
  },
  (table) => [primaryKey({ columns: [table.userId, table.techId] })],
);

export const relations = defineRelations(
  { user, account, session, techs, tags, impressions, techTags, votes },
  (r) => ({
    user: {
      sessions: r.many.session(),
      accounts: r.many.account(),
      votes: r.many.votes(),
    },
    session: {
      user: r.one.user({
        from: r.session.userId,
        to: r.user.id,
      }),
    },
    account: {
      user: r.one.user({
        from: r.account.userId,
        to: r.user.id,
      }),
    },
    techs: {
      tags: r.many.tags({
        from: r.techs.id.through(r.techTags.techId),
        to: r.tags.id.through(r.techTags.tagId),
      }),
      votes: r.many.votes(),
      user: r.many.user({
        from: r.techs.id.through(r.votes.techId),
        to: r.user.id.through(r.votes.userId),
      }),
    },
    tags: {
      techs: r.many.techs({
        from: r.tags.id.through(r.techTags.tagId),
        to: r.techs.id.through(r.techTags.techId),
      }),
    },
    impressions: {
      votes: r.many.votes(),
    },
    votes: {
      user: r.one.user({
        from: r.votes.userId,
        to: r.user.id,
        optional: false,
      }),
      tech: r.one.techs({
        from: r.votes.techId,
        to: r.techs.id,
        optional: false,
      }),
      impression: r.one.impressions({
        from: r.votes.impressionId,
        to: r.impressions.id,
        optional: false,
      }),
    },
  }),
);

export * from "./auth-schema";
