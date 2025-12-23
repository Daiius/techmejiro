import { db } from "db";
import { votes, techs } from "db/schema";
import { sql, eq, and, inArray, not } from "drizzle-orm";

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

export const getAnalysisByTechKey = async (techKey: string) => {
  // cannot use groupBy...
  //const relatedVotes = await db.query.votes.findMany({
  //  where: {
  //    AND: [
  //      { RAW: 
  //          sql`${votes.userId} in (
  //            select user_id from Votes where tech_id = ${techKeyToId[techKey]}
  //          )`,
  //      },
  //      { NOT: { techId: techKeyToId[techKey] } },
  //    ],
  //  },
  //  with: {
  //    tech: { columns: { name: true, key: true, } },
  //    impression: { columns: { name: true, key: true, } },
  //  },
  //  columns: {},
  //});
  const relatedVotes = await db
    .select({
      techKey: techs.key,
      techName: techs.name,
      userCount: sql<number>`count(distinct ${votes.userId}`.as('user_count'),
    })
    .from(votes)
    .innerJoin(techs, eq(votes.techId, techs.id))
    .where(
      and(
        sql`${votes.userId} IN (
          SELECT user_id FROM Votes WHRER tech_id = ${techKeyToId[techKey]}
        )`,
        not(eq(votes.techId, techKeyToId[techKey])),
      ),
    )
    .groupBy(votes.techId, techs.key, techs.name);


  return relatedVotes;
}
