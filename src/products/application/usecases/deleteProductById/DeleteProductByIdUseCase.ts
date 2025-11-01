import ProductOutput from "@/products/application/usecases/default/ProductOutput";
import DeleteProductByIdInput from "@/products/application/usecases/deleteProductById/DeleteProductByIdInput";

export default interface DeleteProductByIdUseCase {
    execute(input: DeleteProductByIdInput): Promise<ProductOutput>;
}