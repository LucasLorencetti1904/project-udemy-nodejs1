import type ResetUserPasswordUseCase from "@/users/application/usecases/resetUserPassword/ResetUserPasswordUseCase";
import type ResetUserPasswordInput from "@/users/application/dto/ResetUserPasswordInput";

export default class ResetUserPasswordUseCaseImpl implements ResetUserPasswordUseCase {
    public async execute(input: ResetUserPasswordInput): Promise<void> {
        
    }
}