import { techTags, techs, tags } from "./db/schema";
import { db, client } from "./db";

// タグを挿入
await db.insert(tags).values([
  { key: "fe", name: "frontend" },
  { key: "be", name: "backend" },
  { key: "db", name: "database" },
  { key: "orm", name: "orm" },
  { key: "mig", name: "migration" },
  { key: "fw", name: "framework" },
  { key: "lb", name: "library" },
  { key: "pf", name: "platform" },
]);

// 技術を挿入
await db.insert(techs).values([
  { key: "nextjs", name: "Next.js" },
  { key: "tanstack-start", name: "TanStack Start" },
  { key: "react", name: "React" },
  { key: "vue", name: "Vue" },
  { key: "mysql", name: "MySQL" },
  { key: "postgres", name: "PostgresSQL" },
  { key: "hono", name: "Hono" },
  { key: "express", name: "Express" },
  { key: "drizzle-orm", name: "Drizzle ORM" },
  { key: "prisma", name: "Prisma" },
  { key: "vercel", name: "Vercel" },
  { key: "aws-amplify", name: "AWS Amplify" },
]);

// 技術とタグの関連付け定義（keyベース）
const techTagRelations = [
  { techKey: "nextjs", tagKeys: ["fe", "fw"] },
  { techKey: "tanstack-start", tagKeys: ["fe", "fw"] },
  { techKey: "react", tagKeys: ["fe", "lb"] },
  { techKey: "vue", tagKeys: ["fe", "fw"] },
  { techKey: "mysql", tagKeys: ["db"] },
  { techKey: "postgres", tagKeys: ["db"] },
  { techKey: "hono", tagKeys: ["be", "fw"] },
  { techKey: "express", tagKeys: ["be", "fw"] },
  { techKey: "drizzle-orm", tagKeys: ["db", "lb"] },
  { techKey: "prisma", tagKeys: ["db", "lb"] },
  { techKey: "vercel", tagKeys: ["pf"] },
  { techKey: "aws-amplify", tagKeys: ["pf"] },
];

// 全てのタグと技術を取得
const allTags = await db.select().from(tags);
const allTechs = await db.select().from(techs);

// Mapで高速検索用のインデックスを作成
const tagMap = new Map(allTags.map((tag) => [tag.key, tag.id]));
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

await client.end();
