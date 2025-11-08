import type ProductModel from "@/products/domain/models/ProductModel";
import type { SearchInput, SearchOutput } from "@/common/application/dto/SearchIo";


export type SearchProductInput = SearchInput<ProductModel>;

export type SearchProductOutput = SearchOutput<ProductModel>;