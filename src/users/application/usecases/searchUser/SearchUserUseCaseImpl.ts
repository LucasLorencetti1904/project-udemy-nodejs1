import { inject, injectable } from "tsyringe";
import UserUseCase from "@/users/application/usecases/default/UserUseCase";
import type SearchUserUseCase from "@/users/application/usecases/searchUser/SearchUserUseCase";
import type UserRepository from "@/users/domain/repositories/UserRepository";
import type UserModel from "@/users/domain/models/UserModel";
import type { SearchUserInput, SearchUserOutput } from "@/users/application/dto/searchUserIo";
import type { UserOutput } from "@/users/application/dto/userIo";
import type { RepositorySearchOutput } from "@/common/domain/repositories/repositorySearchIo";

@injectable()
export default class SearchUserUseCaseImpl extends UserUseCase implements SearchUserUseCase {
    constructor(
        @inject("UserRepository")
        protected readonly repo: UserRepository
    ) { super(repo); }

    public async execute(input: SearchUserInput): Promise<SearchUserOutput> {
        try {
            const output: RepositorySearchOutput<UserModel> = await this.repo.search(input);
            return this.toUseCaseOutput(output);
        }
        catch (e: unknown) {
            this.handleApplicationErrors(e);
        }
    }

    private toUseCaseOutput(repoOutput: RepositorySearchOutput<UserModel>): SearchUserOutput {
        return {
            items: this.mapSearchResultUsersToOutput(repoOutput.items),
            total: repoOutput.total,
            perPage: repoOutput.perPage,
            lastPage: this.calcLastPage(repoOutput.total, repoOutput.perPage),
            currentPage: repoOutput.currentPage
        };
    }

    private mapSearchResultUsersToOutput(users: UserModel[]): UserOutput[] {
        return users.map((user) => {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                avatar: user.avatar
            };
        });
    }

    private calcLastPage(total: number, perPage: number) {
        const result: number = Math.ceil(total / perPage);
        return result < 1 ? 1 : result;
    }
}