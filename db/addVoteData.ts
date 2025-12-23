import { votes, user } from "./db/schema";
import type { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "./db/schema";

export async function addVoteData(
  db: MySql2Database<typeof schema>,
  techMap: Map<string, number>,
  impressionMap: Map<string, number>
) {
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
}
