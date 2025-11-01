export type SearchInput<TModel> = & {
    page?: number,
    perPage?: number,
    sort?: keyof TModel,
    sortDir?: "asc" | "desc",
    filter?: string
};

export type SearchOutput<TModel> = {
    items: TModel[],
    total: number,
    currentPage: number,
    perPage: number,
    lastPage: number
};