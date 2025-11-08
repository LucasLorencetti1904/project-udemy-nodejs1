import { inject, injectable } from "tsyringe";
import ProductUseCase from "@/products/application/usecases/default/ProductUseCase";
import type SearchProductUseCase from "@/products/application/usecases/searchProduct/SeachProductUseCase";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type ProductModel from "@/products/domain/models/ProductModel";
import type { SearchProductInput, SearchProductOutput } from "@/products/application/dto/searchProdutIo";
import type { RepositorySearchOutput } from "@/common/domain/repositories/repositorySearchIo";

@injectable()
export default class SearchProductUseCaseImpl extends ProductUseCase implements SearchProductUseCase {
    constructor(
        @inject("ProductRepository")
        protected readonly repo: ProductRepository
    ) { super(repo); }

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
            lastPage: this.calcLastPage(repoOutput.total, repoOutput.perPage),
            currentPage: repoOutput.currentPage
        };
    }

    private calcLastPage(total: number, perPage: number) {
        const result: number = Math.ceil(total / perPage);
        return result < 1 ? 1 : result;
    }
}