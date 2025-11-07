import BaseUseCase from "@/common/application/usecases/BaseUseCase";
import { ConflictError } from "@/common/domain/errors/httpErrors";
import type UserModel from "@/users/domain/models/UserModel";
import UserRepository from "@/users/domain/repositories/UserRepository";
import type { UserOutput } from "@/users/application/dto/userIo";

export default abstract class UserUseCase extends BaseUseCase {
    constructor(
        protected readonly repo: UserRepository
    ) { super() }

    protected mapToUserOutput(model: UserModel): UserOutput {
        return {
            id: model.id,
            name: model.name,
            email: model.email,
            avatar: model.avatar,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt
        }
    }

    protected async checkIfEmailAlreadyExists(email: string): Promise<void> {
        if (await this.emailAlreadyExists(email)) {
            throw new ConflictError(`User already registered with email ${email}.`);
        }
    }
    private async emailAlreadyExists(email: string): Promise<boolean> {
        return !email || !!(await this.repo.findByEmail(email));
    }
}