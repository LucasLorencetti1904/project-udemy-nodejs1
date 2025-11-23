import type ResetUserPasswordInput from "@/users/application/dto/ResetUserPasswordInput";

export default interface ResetUserPasswordUseCase {
    execute(input: ResetUserPasswordInput): Promise<void>;
}