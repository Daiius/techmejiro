import { techTags, techs } from "./db/schema";
import type { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "./db/schema";

export async function addTechData(
  db: MySql2Database<typeof schema>,
  tagMap: Map<string, number>,
) {
  // 技術を挿入
  await db.insert(techs).values([
    { key: "nextjs", name: "Next.js" },
    { key: "tanstack-start", name: "TanStack Start" },
    { key: "react", name: "React" },
    { key: "vue", name: "Vue" },
    { key: "svelte", name: "Svelte" },
    { key: "angular", name: "Angular" },
    { key: "solidjs", name: "Solid.js" },
    { key: "astro", name: "Astro" },
    { key: "remix", name: "Remix" },
    { key: "nuxt", name: "Nuxt" },
    { key: "mysql", name: "MySQL" },
    { key: "postgres", name: "PostgresSQL" },
    { key: "mongodb", name: "MongoDB" },
    { key: "redis", name: "Redis" },
    { key: "sqlite", name: "SQLite" },
    { key: "supabase", name: "Supabase" },
    { key: "hono", name: "Hono" },
    { key: "express", name: "Express" },
    { key: "fastify", name: "Fastify" },
    { key: "nestjs", name: "NestJS" },
    { key: "koa", name: "Koa" },
    { key: "elysia", name: "Elysia" },
    { key: "drizzle-orm", name: "Drizzle ORM" },
    { key: "prisma", name: "Prisma" },
    { key: "typeorm", name: "TypeORM" },
    { key: "kysely", name: "Kysely" },
    { key: "vercel", name: "Vercel" },
    { key: "aws-amplify", name: "AWS Amplify" },
    { key: "cloudflare", name: "Cloudflare" },
    { key: "netlify", name: "Netlify" },
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
