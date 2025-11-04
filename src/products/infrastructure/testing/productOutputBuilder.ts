import { updateProductInputBuilder } from "@/products/infrastructure/testing/productInputBuilder";
import type { ProductOutput } from "@/products/application/usecases/default/productIo";

export default function productOutputBuilder(props: Partial<ProductOutput>): ProductOutput {
    return {
        ...updateProductInputBuilder({ ...props }),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date()
    };
}