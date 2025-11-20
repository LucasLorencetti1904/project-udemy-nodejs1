type SearchRequest = { 
    pageNumber?: number,
    itemsPerPage?: number,
    sortField?: string,
    sortDirection?: string,
    filterField?: string,
    filterValue?: string
};

export default SearchRequest;