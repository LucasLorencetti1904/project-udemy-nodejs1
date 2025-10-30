import { updateProductInputBuilder } from "@/products/infrastructure/testing/productInputBuilder";
import type ProductModel from "@/products/domain/models/ProductModel";

export default function productOutputBuilder(props: Partial<ProductModel>): ProductModel {
    return {
        ...updateProductInputBuilder({ ...props }),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date()
    };
}