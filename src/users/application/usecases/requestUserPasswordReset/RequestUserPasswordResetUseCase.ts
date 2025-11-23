import type { RequestUserPasswordResetInput, RequestUserPasswordResetOutput } from "@/users/application/dto/requestUserPasswordResetIo";

export default interface RequestUserPasswordResetUseCase {
    execute(input: RequestUserPasswordResetInput): Promise<RequestUserPasswordResetOutput>;
}