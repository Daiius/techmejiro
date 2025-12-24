import { impressions } from "./db/schema";
import { db, client } from "./db";
import { addTagData } from "./addTagData";
import { addTechData } from "./addTechData";
import { addVoteData } from "./addVoteData";

// タグを挿入
const tagMap = await addTagData(db);

// 技術を挿入
const techMap = await addTechData(db, tagMap);

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
