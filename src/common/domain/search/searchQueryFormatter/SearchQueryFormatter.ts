import type RepositorySearchDSL from "@/common/domain/search/repositorySearcher/RepositorySearchDSL";
import RepositorySearchinput from "@/common/domain/search/repositorySearcher/RepositorySearchInput";

export default interface SearchQueryFormatter<TModel> {
    formatInput(queryInput: RepositorySearchinput<TModel>): RepositorySearchDSL<TModel>;
}