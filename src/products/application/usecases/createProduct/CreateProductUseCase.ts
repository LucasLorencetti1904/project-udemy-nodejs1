import type CreateProductInput from "@/products/application/usecases/createProduct/CreateProductInput";
import type ProductOutput from "@/products/application/usecases/default/ProductOutput";

export default interface CreateProductUseCase {
    execute(data: CreateProductInput): Promise<ProductOutput>;
}