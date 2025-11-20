export type RepositorySearchPagination = {
    pageNumber: number,
    itemsPerPage: number   
};

export type RepositorySearchFilter<TModel> = {
    field: keyof TModel,
    value: string
};

export type RepositorySearchSorting<TModel> = {
    field: keyof TModel,
    direction: "asc" | "desc"
};

type RepositorySearchParams<TModel> = {
    pagination: RepositorySearchPagination,
    filter: RepositorySearchFilter<TModel>,
    sorting: RepositorySearchSorting<TModel>
};

export default RepositorySearchParams;