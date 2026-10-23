import type { Account } from "../../domain/entities/account.entity";
import type { AccountOutputDto } from "../dto/account-output.dto";

export function toAccountOutput(account: Account): AccountOutputDto {
  return { account_id: account.id, status: account.status };
}
