import type { SearchProductInput, SearchProductOutput } from "@/products/application/dto/searchProductIo";

export default interface SearchProductUseCase {
    execute(input: SearchProductInput): Promise<SearchProductOutput>;
}