import { db } from "db";

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
    columns: {},
    where: { userId },
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
