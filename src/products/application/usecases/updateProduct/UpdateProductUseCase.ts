import type UpdateProductInput from "@/products/application/dto/UpdateProductInput";
import type { ProductOutput } from "@/products/application/dto/productIo";

export default interface UpdateProductUseCase {
    execute(data: UpdateProductInput): Promise<ProductOutput>;
}