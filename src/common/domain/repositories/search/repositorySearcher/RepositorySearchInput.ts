export type RepositorySearchInputPagination = {
    pageNumber?: number,
    itemsPerPage?: number
};

export type RepositorySearchInputSorting = {
    field?: string,
    direction?: string
};

export type RepositorySearchInputFilter = {
    field?: string,
    value?: string
};

type RepositorySearchinput = {
    pagination?: RepositorySearchInputPagination,
    sorting?: RepositorySearchInputSorting,
    filter?: RepositorySearchInputFilter
};

export default RepositorySearchinput;