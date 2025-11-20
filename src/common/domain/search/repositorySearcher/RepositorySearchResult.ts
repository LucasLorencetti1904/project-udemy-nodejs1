import type { RepositorySearchFilter, RepositorySearchSorting } from "@/common/domain/search/repositorySearcher/RepositorySearchParams";

export type RepositorySearchPaginationResult = {
    currentPage: number,
    itemsPerPage: number
};

export type RepositorySearchFilterResult<TModel> = RepositorySearchFilter<TModel>;

export type RepositorySearchSortingResult<TModel> = RepositorySearchSorting<TModel>;

export type RepositorySearchResult<TModel> = {
    items: TModel[],
    total: number,
    pagination: RepositorySearchPaginationResult,
    filter: RepositorySearchFilterResult<TModel>,
    sorting: RepositorySearchSortingResult<TModel>
};

export default RepositorySearchResult;