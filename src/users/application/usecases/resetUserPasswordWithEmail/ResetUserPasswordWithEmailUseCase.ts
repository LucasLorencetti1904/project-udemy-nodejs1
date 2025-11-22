import type { ResetUserPasswordWithEmailInput, ResetUserPasswordWithEmailOutput } from "@/users/application/dto/ResetUserPasswordWithEmailIo";

export default interface ResetUserPasswordWithEmailUseCase {
    execute(input: ResetUserPasswordWithEmailInput): Promise<ResetUserPasswordWithEmailOutput>;
}