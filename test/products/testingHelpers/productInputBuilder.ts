import type { ProductInput } from "@/products/application/dto/productIo";
import type CreateProductInput from "@/products/application/dto/CreateProductInput";
import type UpdateProductInput from "@/products/application/dto/UpdateProductInput";
import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";

export default function productInputBuilder(props: Partial<ProductInput>): ProductInput {
    return {
        name: props.name ?? faker.commerce.productName(),
        price: props.price ?? Number(faker.commerce.price({ min: 100, max: 2000, dec: 2 })),
        quantity: props.quantity ?? faker.number.int({ min: 1, max: 1000 })
    };
}

export function createProductInputBuilder(props: Partial<CreateProductInput>): CreateProductInput {
    return {
        name: props.name ?? faker.commerce.productName(),
        price: props.price ?? Number(faker.commerce.price({ min: 100, max: 2000, dec: 2 })),
        quantity: props.quantity ?? faker.number.int({ min: 1, max: 1000 })
    };
}

export function updateProductInputBuilder(props: Partial<UpdateProductInput>): UpdateProductInput {
    return {
        id: props.id ?? randomUUID(),
        name: props.name ?? faker.commerce.productName(),
        price: props.price ?? Number(faker.commerce.price({ min: 100, max: 2000, dec: 2 })),
        quantity: props.quantity ?? faker.number.int({ min: 1, max: 1000 })
    };
}