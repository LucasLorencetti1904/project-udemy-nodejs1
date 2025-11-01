import type { SearchProductInput, SearchProductOutput } from "@/products/application/usecases/searchProduct/SearchProdutIo";

export default interface SearchProductUseCase {
    execute(input: SearchProductInput): Promise<SearchProductOutput>;
}