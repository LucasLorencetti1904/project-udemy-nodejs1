import type GetProductByIdInput from "@/products/application/usecases/getProductById/GetProductByIdInput";
import type ProductOutput from "@/products/application/ProductOutput";

export default interface GetProductByIdUseCase {
    execute(input: GetProductByIdInput): Promise<ProductOutput>;
}