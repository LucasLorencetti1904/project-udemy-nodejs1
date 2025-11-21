type SearchUserRequest = {
    pageNumber?: number;
    itemsPerPage?: number;
    sortField?: string;
    sortDirection?: string;
    filterField?: string;
    filterValue?: string;
};

export default SearchUserRequest;