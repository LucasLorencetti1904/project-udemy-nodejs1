import type { SearchInput, SearchOutput } from "@/common/application/dto/SearchIo";
import type ProductModel from "@/products/domain/models/ProductModel"


export type SearchProductInput = SearchInput<ProductModel>;

export type SearchProductOutput = SearchOutput<ProductModel>;