export type RepositorySearchDSLPagination = {
    pageNumber: number,
    itemsPerPage: number
};

export type RepositorySearchDSLSorting<TModel> = {
    field: keyof TModel,
    direction: "asc" | "desc"
};

export type RepositorySearchDSLFilter<TModel> = {
    field: keyof TModel,
    value: string
};

type RepositorySearchDSL<TModel> = {
    pagination?: RepositorySearchDSLPagination,
    sorting?: RepositorySearchDSLSorting<TModel>,
    filter?: RepositorySearchDSLFilter<TModel>
};
export default RepositorySearchDSL;