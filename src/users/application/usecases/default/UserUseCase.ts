import BaseUseCase from "@/common/application/usecases/BaseUseCase";
import type UserRepository from "@/users/domain/repositories/UserRepository";
import type UserModel from "@/users/domain/models/UserModel";
import type { UserOutput } from "@/users/application/dto/userIo";

export default abstract class UserUseCase extends BaseUseCase {
    constructor(
        protected readonly repo: UserRepository
    ) { super(); }

    protected mapToUserOutput(model: UserModel): UserOutput {
        return {
            id: model.id,
            name: model.name,
            email: model.email,
            avatar: model.avatar,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt
        };
    }
}