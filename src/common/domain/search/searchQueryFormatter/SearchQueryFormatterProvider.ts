import type RepositorySearchinput from "@/common/domain/search/repositorySearcher/RepositorySearchInput";
import type RepositorySearchDSL from "@/common/domain/search/repositorySearcher/RepositorySearchDSL";

export default interface SearchQueryFormatterProvider<TModel> {
    formatInput(queryInput: RepositorySearchinput): RepositorySearchDSL<TModel>;
}