import { InfrastructureFailure } from "@shared/failures/infrastructure-failure";
import { err, ok, type Result } from "@shared/result/result";
import type { Account, AccountId } from "../../domain/entities/account.entity";
import type { AuthFailure } from "../../domain/failures/auth-failure";

const ACCOUNT_ID = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

export function toAccount(value: unknown): Result<Account, AuthFailure> {
  if (
    !value ||
    typeof value !== "object" ||
    !("account_id" in value) ||
    typeof value.account_id !== "string" ||
    !ACCOUNT_ID.test(value.account_id) ||
    !("status" in value) ||
    value.status !== "active"
  )
    return err(InfrastructureFailure.parse("account-dto"));

  return ok({ id: value.account_id as AccountId, status: "active" });
}
