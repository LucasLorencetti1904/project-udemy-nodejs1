import type CreateProductInput from "@/products/application/usecases/createProduct/CreateProductIoDto";
import type ProductOutput from "@/products/application/ProductOutput";

export default interface CreateProductUseCase {
    execute(data: CreateProductInput): Promise<ProductOutput>;
}