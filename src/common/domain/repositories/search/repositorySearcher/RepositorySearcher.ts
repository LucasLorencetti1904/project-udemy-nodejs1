import type RepositorySearchDSL from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchDSL";
import type RepositorySearchResult from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchResult";

export default interface RepositorySearcher<TModel> {
    search(source: unknown, dsl: RepositorySearchDSL<TModel>): Promise<RepositorySearchResult<TModel>>;
}