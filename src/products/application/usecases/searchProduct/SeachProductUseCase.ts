import type { SearchProductInput, SearchProductOutput } from "@/products/application/dto/searchProdutIo";

export default interface SearchProductUseCase {
    execute(input: SearchProductInput): Promise<SearchProductOutput>;
}