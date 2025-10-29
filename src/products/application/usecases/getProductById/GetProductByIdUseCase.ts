import type GetProductByIdProductInput from "@/products/application/usecases/getProductById/GetProductByIdInput";
import type ProductOutput from "@/products/application/ProductOutput";

export default interface GetProductByIdUseCase {
    execute(input: GetProductByIdProductInput): Promise<ProductOutput>;
}