import { inject, injectable } from "tsyringe";
import ProductUseCase from "@/products/application/usecases/default/ProductUseCase";
import type SearchProductUseCase from "@/products/application/usecases/searchProduct/SeachProductUseCase";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type SearchQueryFormatterProvider from "@/common/domain/repositories/search/searchQueryFormatter/SearchQueryFormatterProvider";
import type ProductModel from "@/products/domain/models/ProductModel";
import type { SearchProductInput, SearchProductOutput } from "@/products/application/dto/searchProductIo";
import type RepositorySearchResult from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchResult";
import RepositorySearchDSL from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchDSL";

@injectable()
export default class SearchProductUseCaseImpl extends ProductUseCase implements SearchProductUseCase {
    constructor(
        @inject("ProductRepository")
        protected readonly repo: ProductRepository,
        private readonly queryFormatter: SearchQueryFormatterProvider<ProductModel>
    ) { super(repo); }

    public async execute(input: SearchProductInput): Promise<SearchProductOutput> {
        try {
            const dsl: RepositorySearchDSL<ProductModel> = this.queryFormatter.formatInput(input);
            const result: RepositorySearchResult<ProductModel> = await this.repo.search(dsl);
            return this.toUseCaseOutput(result);
        }
        catch (e: unknown) {
            this.handleApplicationErrors(e);
        }
    }

    private toUseCaseOutput(repoOutput: RepositorySearchResult<ProductModel>): SearchProductOutput {
        return {
            items: repoOutput.items,
            total: repoOutput.total,
            pagination: {
                currentPage: repoOutput.pagination.currentPage,
                itemsPerPage: repoOutput.pagination.itemsPerPage,
                lastPage: this.calcLastPage(repoOutput.total, repoOutput.pagination.itemsPerPage)
            }
        };
    }

    private calcLastPage(total: number, perPage: number) {
        const result: number = Math.ceil(total / perPage);
        return result < 1 ? 1 : result;
    }
}