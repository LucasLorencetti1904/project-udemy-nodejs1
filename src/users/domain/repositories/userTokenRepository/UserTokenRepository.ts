import type Repository from "@/common/domain/repositories/Repository";
import type UserTokenModel from "@/users/domain/models/UserTokenModel";
import type CreateUserTokenProps from "@/users/domain/repositories/userTokenRepository/UserTokenRepository";

export default interface UserTokenRepository extends Repository<UserTokenModel, CreateUserTokenProps> {
    generate(userId: string): Promise<null | UserTokenModel>;
    findByToken(token: string): Promise<null | UserTokenModel>;
}