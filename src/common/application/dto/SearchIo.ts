export type SearchInputPagination = {
    pageNumber?: number,
    itemsPerPage?: number
};

export type SearchInputSorting = {
    field?: string,
    direction?: string
};

export type SearchInputFilter = {
    field?: string,
    value?: string
};

export type SearchOutputPagination = {
    currentPage: number,
    lastPage: number,
    itemsPerPage: number
};

export type SearchInput = {
    pagination?: SearchInputPagination,
    sorting?: SearchInputSorting,
    filter?: SearchInputFilter
};

export type SearchOutput<TModel> = {
    items: TModel[],
    total: number,
    pagination: SearchOutputPagination
};