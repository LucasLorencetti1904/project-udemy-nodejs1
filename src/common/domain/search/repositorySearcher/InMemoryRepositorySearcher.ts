import { injectable } from "tsyringe";
import type RepositorySearcher from "@/common/domain/search/repositorySearcher/RepositorySearcher";
import type RepositorySearchDSL from "@/common/domain/search/repositorySearcher/RepositorySearchDSL";
import type RepositorySearchResult from "@/common/domain/search/repositorySearcher/RepositorySearchResult";
import type { RepositorySearchFilter, RepositorySearchPagination, RepositorySearchSorting } from "@/common/domain/search/repositorySearcher/RepositorySearchParams";

@injectable()
export default class InMemoryRepositoryRepositorySearcher<TModel> implements RepositorySearcher<TModel> {
    public async search(items: TModel[], dsl: RepositorySearchDSL<TModel>): Promise<RepositorySearchResult<TModel>> {
        const filteredItems: TModel[] = await this.applyFilter(items, dsl.filter);
        const orderedItems: TModel[] = await this.applySort(filteredItems, dsl.sorting);
        const paginatedItems: TModel[] = await this.applyPaginate(orderedItems, dsl.pagination);

        return {
            items: paginatedItems,
            filter: {
                field: dsl.filter.field,
                value: dsl.filter.value
            },
            total: filteredItems.length,
            pagination: {
                currentPage: dsl.pagination.pageNumber,
                itemsPerPage: dsl.pagination.itemsPerPage
            },
            sorting: {
                field: dsl.sorting.field,
                direction: dsl.sorting.direction
            }
        };
    }

    private async applyFilter(items: TModel[], filter: RepositorySearchFilter<TModel>): Promise<TModel[]> {
        return items.filter((item) => {
            return item[filter.field as string].toLowerCase().includes(filter.value.toLocaleLowerCase());
        });
    }

    private async applySort(items: TModel[], sort: RepositorySearchSorting<TModel>): Promise<TModel[]> {
        return [...items].sort((a, b) => {
            if (a[sort.field] < b[sort.field]) {
                return sort.direction === "asc" ? -1 : 1;
            }

            if (a[sort.field] > b[sort.field]) {
                return sort.direction === "asc" ? 1 : -1;
            }
        });
    }

    private async applyPaginate(items: TModel[], pagination: RepositorySearchPagination): Promise<TModel[]> {
        const start: number = (pagination.pageNumber - 1) * pagination.itemsPerPage;
        const end: number = start + pagination.itemsPerPage;
        return items.slice(start, end);
    }
}