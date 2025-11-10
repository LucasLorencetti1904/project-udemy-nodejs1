import type { ProductOutput } from "@/products/application/dto/productIo";
import { randomUUID } from "node:crypto";
import { faker } from "@faker-js/faker";

export default function productOutputBuilder(props: Partial<ProductOutput>): ProductOutput {
    return {
        id: props.id ?? randomUUID(),
        name: props.name ?? faker.commerce.productName(),
        price: props.price ?? Number(faker.commerce.price({ min: 100, max: 2000, dec: 2 })),
        quantity: props.quantity ?? faker.number.int({ min: 1, max: 1000 }),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date()
    };
}