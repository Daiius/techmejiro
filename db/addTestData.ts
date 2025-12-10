import { techTags, techs, tags } from "./db/schema";
import { db, client } from "./db";

// タグを挿入
await db.insert(tags).values([
  { key: "fe", name: "frontend" },
  { key: "be", name: "backend" },
  { key: "db", name: "database" },
  { key: "fw", name: "framework" },
  { key: "lb", name: "library" },
]);

// 技術を挿入
await db.insert(techs).values([
  { key: "nextjs", name: "Next.js" },
  { key: "react", name: "React" },
  { key: "mysql", name: "MySQL" },
  { key: "hono", name: "Hono" },
  { key: "drizzle-orm", name: "Drizzle ORM" },
]);

// 技術とタグの関連付け定義（keyベース）
const techTagRelations = [
  { techKey: "nextjs", tagKeys: ["fe", "fw"] },
  { techKey: "react", tagKeys: ["fe", "lb"] },
  { techKey: "mysql", tagKeys: ["db"] },
  { techKey: "hono", tagKeys: ["be", "fw"] },
  { techKey: "drizzle-orm", tagKeys: ["db", "lb"] },
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
    technologyId: techMap.get(relation.techKey)!,
    tagId: tagMap.get(tagKey)!,
  })),
);

// 技術とタグの関連付けを挿入
await db.insert(techTags).values(techTagValues);

await client.end();
