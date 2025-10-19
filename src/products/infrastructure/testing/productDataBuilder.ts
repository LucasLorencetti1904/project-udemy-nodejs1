import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";
import ProductModel from "@/products/domain/models/ProductModel";

export default function productDataBuilder(props: Partial<ProductModel>): ProductModel {
    return {
        id: props.id ?? randomUUID(),
        name: props.name ?? faker.commerce.productName(),
        price: props.price ?? Number(faker.commerce.price({ min: 100, max: 2000, dec: 2 })),
        quantity: props.quantity ?? faker.number.int({ min: 1, max: 1000 }),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date()
    };
}