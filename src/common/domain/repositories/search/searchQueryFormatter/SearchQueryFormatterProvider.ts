import type RepositorySearchinput from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchInput";
import type RepositorySearchDSL from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchDSL";

export default interface SearchQueryFormatterProvider<TModel> {
    formatInput(queryInput: RepositorySearchinput): RepositorySearchDSL<TModel>;
}