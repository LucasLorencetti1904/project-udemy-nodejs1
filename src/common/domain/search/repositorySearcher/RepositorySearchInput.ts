import type RepositorySearchParams from "@/common/domain/search/repositorySearcher/RepositorySearchParams";
import type { RepositorySearchFilter, RepositorySearchPagination, RepositorySearchSorting } from "@/common/domain/search/repositorySearcher/RepositorySearchParams";

type RepositorySearchInputPagination = Partial<RepositorySearchPagination>;

type RepositorySearchInputSorting<TModel> = Partial<RepositorySearchSorting<TModel>>;

type RepositorySearchInputFilter<TModel> = Partial<RepositorySearchFilter<TModel>>;

type RepositorySearchinput<TModel> = {
    pagination?: RepositorySearchInputPagination,
    sorting?: RepositorySearchInputSorting<TModel>,
    filter?: RepositorySearchInputFilter<TModel>
};

export default RepositorySearchinput;