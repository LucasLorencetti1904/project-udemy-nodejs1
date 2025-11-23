import type { RequestUserPasswordResetInput, RequestUserPasswordResetOutput } from "@/users/application/dto/RequestUserPasswordReset";

export default interface RequestUserPasswordResetUseCase {
    execute(input: RequestUserPasswordResetInput): Promise<RequestUserPasswordResetOutput>;
}