import type CreateProductInput from "@/products/application/dto/CreateProductInput";
import type { ProductOutput } from "@/products/application/dto/productIo";

export default interface CreateProductUseCase {
    execute(data: CreateProductInput): Promise<ProductOutput>;
}