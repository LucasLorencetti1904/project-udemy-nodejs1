import { inject, injectable } from "tsyringe";
import type UserRepository from "@/users/domain/repositories/userRepository/UserRepository"
import type RepositoryProvider from "@/common/domain/repositories/RepositoryProvider";
import type UserModel from "@/users/domain/models/UserModel";
import type CreateUserProps from "@/users/domain/repositories/userRepository/CreateUserProps";
import type RepositorySearchResult from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchResult";
import type RepositorySearchDSL from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchDSL";

@injectable()
export default class UserTypeormRepository implements UserRepository {
    constructor (
        @inject("RepositoryProvider<User>")
        private readonly repo: RepositoryProvider<UserModel, CreateUserProps>,
    ){}

    public async findByName(value: string): Promise<UserModel[]> {
        return await this.repo.findManyBy("name", value);
    }

    public async findByEmail(value: string): Promise<UserModel | null> {
        return await this.repo.findOneBy("email", value);
    }

    public async create(data: CreateUserProps): Promise<UserModel> {
        return await this.repo.create(data);
    }

    public async findById(id: string): Promise<UserModel> {
        return await this.repo.findById(id);
    }

    public async update(model: UserModel): Promise<UserModel> {
        return await this.repo.update(model);
    }

    public async delete(id: string): Promise<UserModel> {
        return await this.repo.delete(id);
    }

    public async search(query: RepositorySearchDSL<UserModel>): Promise<RepositorySearchResult<UserModel>> {
        return await this.repo.search(query);
    }
}