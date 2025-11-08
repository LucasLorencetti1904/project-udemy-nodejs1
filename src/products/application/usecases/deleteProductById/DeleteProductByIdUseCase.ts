import type DeleteProductByIdInput from "@/products/application/dto/DeleteProductByIdInput";
import type { ProductOutput } from "@/products/application/dto/productIo";

export default interface DeleteProductByIdUseCase {
    execute(input: DeleteProductByIdInput): Promise<ProductOutput>;
}