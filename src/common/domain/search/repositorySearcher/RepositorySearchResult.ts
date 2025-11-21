export type RepositorySearchPaginationResult = {
    currentPage: number,
    itemsPerPage: number
};

export type RepositorySearchSortingResult<TModel> = {
    field: keyof TModel,
    direction: "asc" | "desc"
}

export type RepositorySearchFilterResult<TModel> = {
    field: keyof TModel,
    value: string
};


type RepositorySearchResult<TModel> = {
    items: TModel[],
    total: number,
    pagination: RepositorySearchPaginationResult,
    filter: RepositorySearchFilterResult<TModel>,
    sorting: RepositorySearchSortingResult<TModel>
};

export default RepositorySearchResult;