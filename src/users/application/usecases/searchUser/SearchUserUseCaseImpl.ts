import { inject, injectable } from "tsyringe";
import UserUseCase from "@/users/application/usecases/default/UserUseCase";
import type SearchUserUseCase from "@/users/application/usecases/searchUser/SearchUserUseCase";
import type UserRepository from "@/users/domain/repositories/userRepository/UserRepository";
import type SearchQueryFormatterProvider from "@/common/domain/repositories/search/searchQueryFormatter/SearchQueryFormatterProvider";
import type UserModel from "@/users/domain/models/UserModel";
import type { SearchUserInput, SearchUserOutput } from "@/users/application/dto/searchUserIo";
import type { UserOutput } from "@/users/application/dto/userIo";
import type RepositorySearchResult from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchResult";
import type RepositorySearchDSL from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchDSL";

@injectable()
export default class SearchUserUseCaseImpl extends UserUseCase implements SearchUserUseCase {
    constructor(
        @inject("UserRepository")
        protected readonly repo: UserRepository,
        private readonly queryFormatter: SearchQueryFormatterProvider<UserModel>
    ) { super(repo); }

    public async execute(input: SearchUserInput): Promise<SearchUserOutput> {
        try {
            const dsl: RepositorySearchDSL<UserModel> = this.queryFormatter.formatInput(input);
            const result: RepositorySearchResult<UserModel> = await this.repo.search(dsl);
            return this.toUseCaseOutput(result);
        }
        catch (e: unknown) {
            this.handleApplicationErrors(e);
        }
    }

    private toUseCaseOutput(repoOutput: RepositorySearchResult<UserModel>): SearchUserOutput {
        return {
            items: this.mapSearchResultUsersToOutput(repoOutput.items),
            total: repoOutput.total,
            pagination: {
                currentPage: repoOutput.pagination.currentPage,
                itemsPerPage: repoOutput.pagination.itemsPerPage,
                lastPage: this.calcLastPage(repoOutput.total, repoOutput.pagination.itemsPerPage)
            }
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