import type UserTokenModel from "@/users/domain/models/UserTokenModel";

export default interface UserTokenRepository {
    generateToken(userId: string): Promise<null | UserTokenModel>;
    findByToken(token: string): Promise<null | UserTokenModel>;
}