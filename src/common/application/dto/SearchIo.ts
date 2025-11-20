export type SearchInputPagination = {
    pageNumber?: number,
    itemsPerPage?: number
};

export type SearchInputSorting<TModel> = {
    field?: keyof TModel,
    direction?: "asc" | "desc"
};

export type SearchInputFilter<TModel> = {
    field?: keyof TModel,
    value?: string
};

export type SearchOutputPagination = {
    currentPage: number,
    lastPage: number,
    itemsPerPage: number
};

export type SearchInput<TModel> = {
    pagination?: SearchInputPagination,
    sorting?: SearchInputSorting<TModel>,
    filter?: SearchInputFilter<TModel>
};

export type SearchOutput<TModel> = {
    items: TModel[],
    total: number,
    pagination: SearchOutputPagination
};