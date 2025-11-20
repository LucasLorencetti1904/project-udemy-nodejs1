import type RepositorySearchParams from "@/common/domain/search/repositorySearcher/RepositorySearchParams";

type SearchQueryFormatterConfig<TModel> = {
    sortableFields: Set<keyof TModel>,
    filterableFields: Set<keyof TModel>,
    defaultProperties: RepositorySearchParams<TModel>
};

export default SearchQueryFormatterConfig;