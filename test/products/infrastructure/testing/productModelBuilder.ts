import { updateProductInputBuilder } from "@/products/infrastructure/testing/productInputBuilder";
import ProductModel from "@/products/domain/models/ProductModel";

export default function productModelBuilder(props: Partial<ProductModel>): ProductModel {
    return {
        ...updateProductInputBuilder({ ...props }),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date()
    };
}