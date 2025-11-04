export type RepositorySearchInput<TModel> = {
    page?: number,
    perPage?: number,
    sort?: keyof TModel,
    sortDir?: "asc" | "desc",
    filter?: string
};

export type RepositorySearchOutput<TModel> = {
    items: TModel[],
    total: number,
    currentPage: number,
    perPage: number,
    sort: keyof TModel,
    sortDir: "asc" | "desc",
    filter: string
};