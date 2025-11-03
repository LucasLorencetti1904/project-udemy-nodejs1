import type { SearchProductInput, SearchProductOutput } from "@/products/application/usecases/searchProduct/SearchProdutIo";
import type SearchProductUseCase from "@/products/application/usecases/searchProduct/SeachProductUseCase";
import { inject } from "tsyringe";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type { RepositorySearchOutput } from "@/common/domain/repositories/Repository";
import type ProductModel from "@/products/domain/models/ProductModel";
import ReadProductUseCase from "@/products/application/usecases/default/ReadProductUseCase";

export default class SearchProductUseCaseImpl extends ReadProductUseCase implements SearchProductUseCase {
    constructor(
        @inject("ProductRepository")
        protected readonly repo: ProductRepository
    ) { super(repo) }

    public async execute(input: SearchProductInput): Promise<SearchProductOutput> {
        try {
            const output: RepositorySearchOutput<ProductModel> = await this.repo.search(input);
            return this.toUseCaseOutput(output);
        }
        catch (e: unknown) {
            this.handleApplicationErrors(e);
        }
    }

    private toUseCaseOutput(repoOutput: RepositorySearchOutput<ProductModel>): SearchProductOutput {
        return {
            items: repoOutput.items,
            total: repoOutput.total,
            perPage: repoOutput.perPage,
            lastPage: Math.ceil(repoOutput.total / repoOutput.perPage),
            currentPage: repoOutput.currentPage
        }
    }
}