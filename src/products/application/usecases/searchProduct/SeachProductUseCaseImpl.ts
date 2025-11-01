import type { SearchProductInput, SearchProductOutput } from "@/products/application/usecases/searchProduct/SearchProdutIo";
import type SearchProductUseCase from "@/products/application/usecases/searchProduct/SeachProductUseCase";
import { inject } from "tsyringe";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type { RepostitorySearchOutput } from "@/common/domain/repositories/Repository";
import type ProductModel from "@/products/domain/models/ProductModel";

export default class SearchProductUseCaseImpl implements SearchProductUseCase {
    constructor(
        @inject("ProductRepository")
        protected readonly repo: ProductRepository
    ) {}

    public async execute(input: SearchProductInput): Promise<SearchProductOutput> {
        const output: RepostitorySearchOutput<ProductModel> = await this.repo.search(input);
        return this.toUseCaseOutput(output);
    }

    private toUseCaseOutput(repoOutput: RepostitorySearchOutput<ProductModel>): SearchProductOutput {
        return {
            items: repoOutput.items,
            total: repoOutput.total,
            perPage: repoOutput.perPage,
            lastPage: Math.ceil(repoOutput.total / repoOutput.perPage),
            currentPage: repoOutput.currentPage
        }
    }
}