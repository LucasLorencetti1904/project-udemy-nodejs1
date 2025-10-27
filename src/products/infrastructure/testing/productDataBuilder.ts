import { randomUUID } from "node:crypto";
import ProductModel from "@/products/domain/models/ProductModel";
import createProductInputBuilder from "@/products/infrastructure/testing/productInputBuilder";

export default function productDataBuilder(props: Partial<ProductModel>): ProductModel {
    return {
        id: props.id ?? randomUUID(),
        ...createProductInputBuilder(props),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date()
    };
}