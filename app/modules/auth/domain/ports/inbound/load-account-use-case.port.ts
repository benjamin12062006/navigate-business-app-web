import type { Result } from "@shared/result/result";
import type { LoadAccountInputDto } from "../../../application/dto/load-account-input.dto";
import type { AccountOutputDto } from "../../../application/dto/account-output.dto";
import type { AuthFailure } from "../../failures/auth-failure";

// Excepción de la plantilla: inbound puede importar tipos DTO de application.
export interface LoadAccountUseCasePort {
  execute(
    input: LoadAccountInputDto,
  ): Promise<Result<AccountOutputDto, AuthFailure>>;
}
