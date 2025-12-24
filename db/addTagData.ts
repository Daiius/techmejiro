import { tags } from "./db/schema";
import type { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "./db/schema";

export async function addTagData(db: MySql2Database<typeof schema>) {
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

  // 全てのタグを取得
  const allTags = await db.select().from(tags);

  // Mapで高速検索用のインデックスを作成
  const tagMap = new Map(allTags.map((tag) => [tag.key, tag.id]));

  console.log(`Generated ${allTags.length} tags`);

  return tagMap;
}
