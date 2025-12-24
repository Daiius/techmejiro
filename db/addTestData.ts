import { techTags, techs, tags, impressions } from "./db/schema";
import { db, client } from "./db";
import { addVoteData } from "./addVoteData";

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

await db.insert(impressions).values([
  //{ key: "unfamiliar", name: "あまり目にしない" },
  { key: "familiar", name: "よく見る" },
  { key: "often-use", name: "よく使う" },
  { key: "favorite", name: "お気に入り" },
]);

// インプレッションのマップを作成
const allImpressions = await db.select().from(impressions);
const impressionMap = new Map(allImpressions.map((imp) => [imp.key, imp.id]));

// テストユーザーと投票データを挿入
// デフォルトでは1000ユーザー、シード値42でランダムデータを生成
// カスタマイズ例:
// await addVoteData(db, techMap, impressionMap, {
//   userCount: 500,
//   seed: 12345,
//   config: {
//     techPopularity: { react: 0.8, nextjs: 0.6, ... },
//     impressionWeights: { familiar: 3, "often-use": 2, favorite: 1 }
//   }
// });
await addVoteData(db, techMap, impressionMap);

await client.end();
