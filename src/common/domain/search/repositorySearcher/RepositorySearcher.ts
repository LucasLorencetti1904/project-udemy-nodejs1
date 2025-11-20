import type RepositorySearchDSL from "@/common/domain/search/repositorySearcher/RepositorySearchDSL";
import type RepositorySearchResult from "@/common/domain/search/repositorySearcher/RepositorySearchResult";

export default interface RepositorySearcher<TModel> {
    search(source: unknown, dsl: RepositorySearchDSL<TModel>): Promise<RepositorySearchResult<TModel>>;
}