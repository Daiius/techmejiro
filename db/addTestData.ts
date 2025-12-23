import { techTags, techs, tags, impressions, votes, user } from "./db/schema";
import { db, client } from "./db";
import { eq } from "drizzle-orm";

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

// テストユーザーを挿入
await db.insert(user).values([
  {
    id: "test-user-001",
    name: "田中太郎",
    email: "tanaka@example.com",
    emailVerified: true,
  },
  {
    id: "test-user-002",
    name: "佐藤花子",
    email: "sato@example.com",
    emailVerified: true,
  },
  {
    id: "test-user-003",
    name: "鈴木一郎",
    email: "suzuki@example.com",
    emailVerified: true,
  },
]);

// 投票データのために必要なIDを取得
const allImpressions = await db.select().from(impressions);

// インプレッションのマップを作成（既に上部で作成済みのtechMapを再利用）
const impressionMap = new Map(
  allImpressions.map((imp) => [imp.key, imp.id])
);

// テストユーザーによる投票データを挿入
// ユーザー1: フロントエンド寄りの技術スタック
// ユーザー2: フルスタック寄りの技術スタック
// ユーザー3: バックエンド寄りの技術スタック
await db.insert(votes).values([
  // 田中太郎（フロントエンド開発者）
  {
    userId: "test-user-001",
    techId: techMap.get("react")!,
    impressionId: impressionMap.get("favorite")!,
  },
  {
    userId: "test-user-001",
    techId: techMap.get("nextjs")!,
    impressionId: impressionMap.get("favorite")!,
  },
  {
    userId: "test-user-001",
    techId: techMap.get("vercel")!,
    impressionId: impressionMap.get("often-use")!,
  },
  {
    userId: "test-user-001",
    techId: techMap.get("postgres")!,
    impressionId: impressionMap.get("familiar")!,
  },

  // 佐藤花子（フルスタック開発者）
  {
    userId: "test-user-002",
    techId: techMap.get("react")!,
    impressionId: impressionMap.get("often-use")!,
  },
  {
    userId: "test-user-002",
    techId: techMap.get("nextjs")!,
    impressionId: impressionMap.get("often-use")!,
  },
  {
    userId: "test-user-002",
    techId: techMap.get("hono")!,
    impressionId: impressionMap.get("favorite")!,
  },
  {
    userId: "test-user-002",
    techId: techMap.get("drizzle-orm")!,
    impressionId: impressionMap.get("favorite")!,
  },
  {
    userId: "test-user-002",
    techId: techMap.get("postgres")!,
    impressionId: impressionMap.get("often-use")!,
  },

  // 鈴木一郎（Vue寄りの開発者）
  {
    userId: "test-user-003",
    techId: techMap.get("react")!,
    impressionId: impressionMap.get("familiar")!,
  },
  {
    userId: "test-user-003",
    techId: techMap.get("vue")!,
    impressionId: impressionMap.get("favorite")!,
  },
  {
    userId: "test-user-003",
    techId: techMap.get("express")!,
    impressionId: impressionMap.get("often-use")!,
  },
  {
    userId: "test-user-003",
    techId: techMap.get("mysql")!,
    impressionId: impressionMap.get("often-use")!,
  },
  {
    userId: "test-user-003",
    techId: techMap.get("prisma")!,
    impressionId: impressionMap.get("familiar")!,
  },
]);

await client.end();
