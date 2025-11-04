import type { ProductOutput } from "@/products/application/dto/productIo";
import type DeleteProductByIdInput from "@/products/application/dto/DeleteProductByIdInput";

export default interface DeleteProductByIdUseCase {
    execute(input: DeleteProductByIdInput): Promise<ProductOutput>;
}