import {
  mysqlTable,
  serial,
  varchar,
  int,
  uniqueIndex,
  index,
} from "drizzle-orm/mysql-core";

export const tags = mysqlTable("tags", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 32 }).notNull(),
  name: varchar("name", { length: 64 }).notNull(),
});

export const techs = mysqlTable("Techs", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 32 }).notNull(),
  name: varchar("name", { length: 64 }).notNull(),
  // description
  // officialUrl
});

export const techTags = mysqlTable(
  "TechTags",
  {
    technologyId: int("tech_id").notNull(),
    tagId: int("tag_id").notNull(),
  },
  (table) => [
    uniqueIndex("tech_tags_pk").on(table.technologyId, table.tagId),
    index("tech_tags_tech_idx").on(table.technologyId),
    index("tech_tags_tag_idx").on(table.tagId),
  ],
);

export * from "./auth-schema";
