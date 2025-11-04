import type { ProductOutput } from "@/products/application/usecases/default/productIo";
import type DeleteProductByIdInput from "@/products/application/usecases/deleteProductById/DeleteProductByIdInput";

export default interface DeleteProductByIdUseCase {
    execute(input: DeleteProductByIdInput): Promise<ProductOutput>;
}