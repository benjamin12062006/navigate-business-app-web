import type { Brand } from "@shared/types/primitive";

export type AccountId = Brand<string, "AccountId">;

export interface Account {
  readonly id: AccountId;
  readonly status: "active";
}
