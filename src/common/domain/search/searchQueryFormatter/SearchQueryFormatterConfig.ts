import type RepositorySearchDSL from "@/common/domain/search/repositorySearcher/RepositorySearchDSL";

type SearchQueryFormatterConfig<TModel> = {
    sortableFields: Set<keyof TModel>,
    filterableFields: Set<keyof TModel>,
    defaultProperties: RepositorySearchDSL<TModel>
};

export default SearchQueryFormatterConfig;