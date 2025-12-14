import type { getTechs } from "@/lib/techs";
import type { getVotes } from "@/lib/votes";
import type { getImpressions } from "@/lib/impressions";

export type ElementType<T> = T extends (infer U)[] ? U : never;
export type Vote = ElementType<Awaited<ReturnType<typeof getVotes>>>;
export type Impression = ElementType<
  Awaited<ReturnType<typeof getImpressions>>
>;
export type Tech = ElementType<Awaited<ReturnType<typeof getTechs>>>;
