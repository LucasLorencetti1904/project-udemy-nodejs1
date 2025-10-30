import type UpdateProductInput from "@/products/application/usecases/updateProduct/UpdateProductInput";
import type ProductOutput from "@/products/application/usecases/default/ProductOutput";

export default interface UpdateProductUseCase {
    execute(data: UpdateProductInput): Promise<ProductOutput>;
}