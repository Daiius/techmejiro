import { db } from "db";
import { votes } from "db/schema";
import { sql, eq, and, inArray } from "drizzle-orm";

const techKeyToId: { [techKey: string]: number } = Object.fromEntries(
  (
    await db.query.techs.findMany({
      columns: { key: true, id: true },
    })
  ).map((tech) => [tech.key, tech.id]),
);

const impressionKeyToId: { [impressionKey: string]: number } =
  Object.fromEntries(
    (
      await db.query.impressions.findMany({ columns: { key: true, id: true } })
    ).map((impression) => [impression.key, impression.id]),
  );

export const getTechs = async () =>
  await db.query.techs.findMany({
    columns: { key: true, name: true },
    with: {
      tags: true,
    },
  });

export const getImpressions = async () =>
  await db.query.impressions.findMany({ columns: { key: true, name: true } });

export const getVotesByUserId = async (userId: string) =>
  await db.query.votes.findMany({
    columns: { techId: true, impressionId: true },
    where: { userId: { eq: userId } },
    with: {
      impression: { columns: { name: true, key: true } },
      tech: {
        columns: {
          name: true,
          key: true,
        },
      },
    },
  });

export const updateVotesByUserId = async (
  userId: string,
  newVotes: { [techKey: string]: string },
) => {
  const filtered = Object.fromEntries(
    Object.entries(newVotes).filter(
      ([_, impressionKey]) => impressionKey in impressionKeyToId,
    ),
  );
  if (Object.keys(filtered).length > 0) {
    await db
      .insert(votes)
      .values(
        Object.entries(filtered).map(([techKey, impressionKey]) => ({
          userId,
          techId: techKeyToId[techKey],
          impressionId: impressionKeyToId[impressionKey],
        })),
      )
      .onDuplicateKeyUpdate({
        set: {
          impressionId: sql`values(${votes.impressionId})`,
        },
      });
  }

  const toDelete = Object.entries(newVotes).filter(
    ([_, impression]) => !(impression in impressionKeyToId),
  ).map(([techKey, _]) => techKey);
  await db.delete(votes).where(
    and(
      eq(votes.userId, userId),
      inArray(
        votes.techId,
        toDelete.map((key) => techKeyToId[key]),
      ),
    ),
  );
};
