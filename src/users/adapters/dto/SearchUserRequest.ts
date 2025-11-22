type SearchUserRequest = {
    pagenumber?: number;
    itemsperpage?: number;
    sortfield?: string;
    sortdirection?: string;
    filterfield?: string;
    filtervalue?: string;
};

export default SearchUserRequest;