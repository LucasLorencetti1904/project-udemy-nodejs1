import { randomUUID } from "node:crypto";
import createProductInputBuilder from "@/products/infrastructure/testing/productInputBuilder";
import type ProductModel from "@/products/domain/models/ProductModel";

export default function productDataBuilder(props: Partial<ProductModel>): ProductModel {
    return {
        id: props.id ?? randomUUID(),
        ...createProductInputBuilder(props),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date()
    };
}