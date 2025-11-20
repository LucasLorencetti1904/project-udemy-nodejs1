import { inject, injectable } from "tsyringe";
import type SearchQueryFormatter from "@/common/domain/search/searchQueryFormatter/SearchQueryFormatter";
import type RepositorySearchDSL from "@/common/domain/search/repositorySearcher/RepositorySearchDSL";
import type SearchQueryFormatterConfig from "@/common/domain/search/searchQueryFormatter/SearchQueryFormatterConfig";
import type RepositorySearchinput from "@/common/domain/search/repositorySearcher/RepositorySearchInput";

@injectable()
export default class SearchQueryFormatterImpl<TModel> implements SearchQueryFormatter<TModel> {
    private finalSearchDSL: RepositorySearchDSL<TModel>;

    constructor(
        private readonly config: SearchQueryFormatterConfig<TModel>
    ) {}

    public formatInput(queryInput: RepositorySearchinput<TModel>): RepositorySearchDSL<TModel> {
        this.finalSearchDSL = {
            pagination: {
                pageNumber: this.setPageNumber(queryInput.pagination?.pageNumber),
                itemsPerPage: this.setItemsPerPage(queryInput.pagination?.itemsPerPage)
            },
            sorting: {
                field: this.setSortField(queryInput.sorting?.field),
                direction: this.setSortDirection(queryInput.sorting?.direction)
            },
            filter:{
                field: this.setFilterField(queryInput.filter?.field),
                value: this.setFilterValue(queryInput.filter?.value)
            }
        }

        return this.finalSearchDSL;
    }
    
    private setPageNumber(pageNumber?: number): number {
        return this.isValidPagination(pageNumber)
            ? pageNumber
            : this.config.defaultProperties.pagination.pageNumber;
    }

    private setItemsPerPage(quantityPerPage?: number): number {
        return this.isValidPagination(quantityPerPage)
            ? quantityPerPage
            : this.config.defaultProperties.pagination.itemsPerPage;
    }

    private setSortField(field?: keyof TModel): keyof TModel {
        return field && this.config.sortableFields.has(field)
            ? field
            : this.config.defaultProperties.sorting.field;
    }

    private setSortDirection(direction?: "asc" | "desc"): "asc" | "desc" {
        return direction
            ? direction
            : this.config.defaultProperties.sorting.direction;
    }

    private setFilterField(field?: keyof TModel): keyof TModel {
        return field && this.config.filterableFields.has(field)
            ? field
            : this.config.defaultProperties.filter.field;
    }
    
    private setFilterValue(value?: string): string {
        return value
            ? value
            : this.config.defaultProperties.filter.value;
    }

    private isValidPagination(paginationNumber?: number): boolean {
        return paginationNumber && paginationNumber > 0 && Number.isInteger(paginationNumber);
    }
}