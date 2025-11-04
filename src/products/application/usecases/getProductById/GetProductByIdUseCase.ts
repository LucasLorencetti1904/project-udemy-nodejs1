import type GetProductByIdInput from "@/products/application/dto/GetProductByIdInput";
import type { ProductOutput } from "@/products/application/dto/productIo";

export default interface GetProductByIdUseCase {
    execute(input: GetProductByIdInput): Promise<ProductOutput>;
}