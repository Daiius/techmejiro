import { techTags, techs } from "./db/schema";
import type { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "./db/schema";

export async function addTechData(
  db: MySql2Database<typeof schema>,
  tagMap: Map<string, number>,
) {
  // 技術を挿入
  await db.insert(techs).values([
    { key: "nextjs", name: "Next.js", url: "https://nextjs.org" },
    { key: "tanstack-start", name: "TanStack Start", url: "https://tanstack.com/start" },
    { key: "react", name: "React", url: "https://react.dev" },
    { key: "vue", name: "Vue", url: "https://vuejs.org" },
    { key: "svelte", name: "Svelte", url: "https://svelte.dev" },
    { key: "angular", name: "Angular", url: "https://angular.dev" },
    { key: "solidjs", name: "Solid.js", url: "https://www.solidjs.com" },
    { key: "astro", name: "Astro", url: "https://astro.build" },
    { key: "remix", name: "Remix", url: "https://remix.run" },
    { key: "nuxt", name: "Nuxt", url: "https://nuxt.com" },
    { key: "mysql", name: "MySQL", url: "https://www.mysql.com" },
    { key: "postgres", name: "PostgresSQL", url: "https://www.postgresql.org" },
    { key: "mongodb", name: "MongoDB", url: "https://www.mongodb.com" },
    { key: "redis", name: "Redis", url: "https://redis.io" },
    { key: "sqlite", name: "SQLite", url: "https://www.sqlite.org" },
    { key: "supabase", name: "Supabase", url: "https://supabase.com" },
    { key: "hono", name: "Hono", url: "https://hono.dev" },
    { key: "express", name: "Express", url: "https://expressjs.com" },
    { key: "fastify", name: "Fastify", url: "https://fastify.dev" },
    { key: "nestjs", name: "NestJS", url: "https://nestjs.com" },
    { key: "koa", name: "Koa", url: "https://koajs.com" },
    { key: "elysia", name: "Elysia", url: "https://elysiajs.com" },
    { key: "drizzle-orm", name: "Drizzle ORM", url: "https://orm.drizzle.team" },
    { key: "prisma", name: "Prisma", url: "https://www.prisma.io" },
    { key: "typeorm", name: "TypeORM", url: "https://typeorm.io" },
    { key: "kysely", name: "Kysely", url: "https://kysely.dev" },
    { key: "vercel", name: "Vercel", url: "https://vercel.com" },
    { key: "aws-amplify", name: "AWS Amplify", url: "https://aws.amazon.com/amplify/" },
    { key: "cloudflare", name: "Cloudflare", url: "https://www.cloudflare.com" },
    { key: "netlify", name: "Netlify", url: "https://www.netlify.com" },
  ]);

  // 技術とタグの関連付け定義（keyベース）
  const techTagRelations = [
    { techKey: "nextjs", tagKeys: ["fe", "fw"] },
    { techKey: "tanstack-start", tagKeys: ["fe", "fw"] },
    { techKey: "react", tagKeys: ["fe", "lb"] },
    { techKey: "vue", tagKeys: ["fe", "fw"] },
    { techKey: "svelte", tagKeys: ["fe", "fw"] },
    { techKey: "angular", tagKeys: ["fe", "fw"] },
    { techKey: "solidjs", tagKeys: ["fe", "fw"] },
    { techKey: "astro", tagKeys: ["fe", "fw"] },
    { techKey: "remix", tagKeys: ["fe", "fw"] },
    { techKey: "nuxt", tagKeys: ["fe", "fw"] },
    { techKey: "mysql", tagKeys: ["db"] },
    { techKey: "postgres", tagKeys: ["db"] },
    { techKey: "mongodb", tagKeys: ["db"] },
    { techKey: "redis", tagKeys: ["db"] },
    { techKey: "sqlite", tagKeys: ["db"] },
    { techKey: "supabase", tagKeys: ["db", "pf"] },
    { techKey: "hono", tagKeys: ["be", "fw"] },
    { techKey: "express", tagKeys: ["be", "fw"] },
    { techKey: "fastify", tagKeys: ["be", "fw"] },
    { techKey: "nestjs", tagKeys: ["be", "fw"] },
    { techKey: "koa", tagKeys: ["be", "fw"] },
    { techKey: "elysia", tagKeys: ["be", "fw"] },
    { techKey: "drizzle-orm", tagKeys: ["db", "lb"] },
    { techKey: "prisma", tagKeys: ["db", "lb"] },
    { techKey: "typeorm", tagKeys: ["db", "lb"] },
    { techKey: "kysely", tagKeys: ["db", "lb"] },
    { techKey: "vercel", tagKeys: ["pf"] },
    { techKey: "aws-amplify", tagKeys: ["pf"] },
    { techKey: "cloudflare", tagKeys: ["pf"] },
    { techKey: "netlify", tagKeys: ["pf"] },
  ];

  // 全ての技術を取得
  const allTechs = await db.select().from(techs);

  // Mapで高速検索用のインデックスを作成
  const techMap = new Map(allTechs.map((tech) => [tech.key, tech.id]));

  // 関連付けデータを生成
  const techTagValues = techTagRelations.flatMap((relation) =>
    relation.tagKeys.map((tagKey) => ({
      techId: techMap.get(relation.techKey)!,
      tagId: tagMap.get(tagKey)!,
    })),
  );

  // 技術とタグの関連付けを挿入
  await db.insert(techTags).values(techTagValues);

  console.log(
    `Generated ${allTechs.length} techs and ${techTagValues.length} tech-tag relations`,
  );

  return techMap;
}
