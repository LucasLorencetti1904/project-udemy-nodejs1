import type UserModel from "@/users/domain/models/UserModel";
import type { UserOutput } from "@/users/application/dto/userDto/userIo";

export default abstract class UserUseCase {
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