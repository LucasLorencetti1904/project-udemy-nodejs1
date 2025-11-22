import { inject, injectable } from "tsyringe";
import type UserTokenRepository from "@/users/domain/repositories/userTokenRepository/UserTokenRepository";
import type UserModel from "@/users/domain/models/UserModel";
import type UserTokenModel from "@/users/domain/models/UserTokenModel";
import CreateUserTokenProps from "@/users/domain/repositories/userTokenRepository/CreateUserTokenProps";
import RepositoryProvider from "@/common/domain/repositories/RepositoryProvider";
import UserRepository from "@/users/domain/repositories/userRepository/UserRepository";
import RepositorySearchDSL from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchDSL";
import RepositorySearchResult from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchResult";

@injectable()
export default class UserTokenTypeormRepository implements UserTokenRepository {
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

    public async findById(id: string): Promise<UserTokenModel | null> {
        return await this.repo.findById(id);
    }

    public async create(data: CreateUserTokenProps): Promise<UserTokenModel> {
        return await this.repo.create(data);
    }

    public async update(model: UserTokenModel): Promise<UserTokenModel> {
        return await this.repo.update(model);
    }

    public async delete(id: string): Promise<UserTokenModel | null> {
        return await this.repo.delete(id);
    }

    public async search(dslQuery: RepositorySearchDSL<UserTokenModel>): Promise<RepositorySearchResult<UserTokenModel>> {
        return await this.repo.search(dslQuery);
    }
}