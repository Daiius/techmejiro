import type { InferResponseType } from "hono/client";
import { honoClientForServer as honoClient } from "./lib/honoClient";

export type ElementType<T> = T extends (infer U)[] ? U : never;

export type Result<T, E> = 
  | { success: true, data: T }
  | { success: false, error: E }

export type Vote = ElementType<InferResponseType<typeof honoClient.votes.$get>>
export type Impression = ElementType<InferResponseType<typeof honoClient.impressions.$get>>
export type Tech = ElementType<InferResponseType<typeof honoClient.techs.$get>>;
export type User = InferResponseType<typeof honoClient.me.$get>;

export type Error =
  | { type: "NetworkError", message: string, status: number }
  | { type: "Unauthorized", message: string }
  | { type: "NotFound", message: string }
  | { type: "ParseError", message: string }
  | { type: "Unexpected", message: string }
