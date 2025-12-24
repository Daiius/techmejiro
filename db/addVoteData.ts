import { votes, user } from "./db/schema";
import type { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "./db/schema";

// シード付き乱数生成器 (Mulberry32)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface TechVoteConfig {
  // 技術keyごとの投票確率 (0-1)
  techPopularity: Record<string, number>;
  // インプレッションkeyごとの重み (合計で正規化される)
  impressionWeights: Record<string, number>;
}

export interface VoteDataParams {
  userCount: number;
  seed: number;
  config: TechVoteConfig;
}

// デフォルト設定
const DEFAULT_CONFIG: TechVoteConfig = {
  techPopularity: {
    react: 0.7,
    nextjs: 0.5,
    "tanstack-start": 0.15,
    vue: 0.4,
    mysql: 0.45,
    postgres: 0.55,
    hono: 0.3,
    express: 0.5,
    "drizzle-orm": 0.25,
    prisma: 0.4,
    vercel: 0.4,
    "aws-amplify": 0.2,
  },
  impressionWeights: {
    familiar: 3,
    "often-use": 2,
    favorite: 1,
  },
};

export async function addVoteData(
  db: MySql2Database<typeof schema>,
  techMap: Map<string, number>,
  impressionMap: Map<string, number>,
  params: Partial<VoteDataParams> = {},
) {
  const { userCount = 1000, seed = 42, config = DEFAULT_CONFIG } = params;

  const random = mulberry32(seed);

  // インプレッション重みの正規化
  const impressionKeys = Object.keys(config.impressionWeights);
  const totalWeight = Object.values(config.impressionWeights).reduce(
    (sum, w) => sum + w,
    0,
  );

  // ユーザー生成
  const users = [];
  for (let i = 0; i < userCount; i++) {
    users.push({
      id: `test-user-${String(i).padStart(6, "0")}`,
      name: `テストユーザー${i + 1}`,
      email: `test-user-${i}@example.com`,
      emailVerified: true,
    });
  }

  // バッチでユーザーを挿入（1000件一度に挿入するとクエリが大きくなるので分割）
  const BATCH_SIZE = 100;
  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    await db.insert(user).values(users.slice(i, i + BATCH_SIZE));
  }

  // 投票データ生成
  const voteData = [];
  for (const u of users) {
    // 各技術について投票するかどうかを確率的に決定
    for (const [techKey, techId] of techMap.entries()) {
      const popularity = config.techPopularity[techKey] ?? 0.3;

      if (random() < popularity) {
        // インプレッションを重み付けランダムで選択
        const r = random() * totalWeight;
        let cumulative = 0;
        let selectedImpression = impressionKeys[0];

        for (const impKey of impressionKeys) {
          cumulative += config.impressionWeights[impKey];
          if (r < cumulative) {
            selectedImpression = impKey;
            break;
          }
        }

        const impressionId = impressionMap.get(selectedImpression);
        if (impressionId) {
          voteData.push({
            userId: u.id,
            techId,
            impressionId,
          });
        }
      }
    }
  }

  // バッチで投票データを挿入
  for (let i = 0; i < voteData.length; i += BATCH_SIZE) {
    await db.insert(votes).values(voteData.slice(i, i + BATCH_SIZE));
  }

  console.log(`Generated ${users.length} users and ${voteData.length} votes`);
}
