import type GetProductByIdInput from "@/products/application/usecases/getProductById/GetProductByIdInput";
import type { ProductOutput } from "@/products/application/usecases/default/productIo";

export default interface GetProductByIdUseCase {
    execute(input: GetProductByIdInput): Promise<ProductOutput>;
}