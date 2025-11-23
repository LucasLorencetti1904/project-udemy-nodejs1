import { inject, injectable } from "tsyringe";
import type UserTokenRepository from "@/users/domain/repositories/userTokenRepository/UserTokenRepository";
import type UserModel from "@/users/domain/models/UserModel";
import type UserTokenModel from "@/users/domain/models/UserTokenModel";
import CreateUserTokenProps from "@/users/domain/repositories/userTokenRepository/CreateUserTokenProps";
import RepositoryProvider from "@/common/domain/repositories/RepositoryProvider";
import UserRepository from "@/users/domain/repositories/userRepository/UserRepository";

@injectable()
export default class UserTokenInMemoryRepository implements UserTokenRepository {
    constructor (
        @inject("RepositoryProvider<UserToken>")
        private readonly repo: RepositoryProvider<UserTokenModel, CreateUserTokenProps>,

        @inject("UserRepository")
        private readonly userRepo: UserRepository
    ) {}

    public async generateToken(userId: string): Promise<null | UserTokenModel> {
        const user: UserModel = await this.userRepo.findById(userId);

        if (!user) {
            return null;
        }

        return await this.repo.create({ userId: user.id });
    }

    public async findByToken(token: string): Promise<null | UserTokenModel> {
        const userToken: UserTokenModel = await this.repo.findOneBy("token", token);

        if (!userToken) {
            return null;
        }

        return userToken;
    }
}