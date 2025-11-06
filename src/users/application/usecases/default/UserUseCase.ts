import BaseUseCase from "@/common/application/usecases/BaseUseCase";
import { ConflictError } from "@/common/domain/errors/httpErrors";
import UserRepository from "@/users/domain/repository/UserRepository";

export default abstract class UserUseCase extends BaseUseCase {
    constructor(
        protected readonly repo: UserRepository
    ) { super() }

    protected async checkIfEmailAlreadyExists(email: string): Promise<void> {
        if (await this.emailAlreadyExists(email)) {
            throw new ConflictError(`User already registered with email ${email}.`);
        }
    }
    private async emailAlreadyExists(email: string): Promise<boolean> {
        return !email || !!(await this.repo.findByEmail(email));
    }
}