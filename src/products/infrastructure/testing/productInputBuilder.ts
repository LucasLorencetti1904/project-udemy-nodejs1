import { faker } from "@faker-js/faker";
import type CreateProductInput from "@/products/application/usecases/createProduct/CreateProductInput";
import type UpdateProductInput from "@/products/application/usecases/updateProduct/UpdateProductInput";
import { randomUUID } from "node:crypto";
import ProductInput from "@/products/application/usecases/default/ProductInput";

export default function productInputBuilder(props: Partial<ProductInput>): Required<ProductInput> {
    return {
        name: props.name ?? faker.commerce.productName(),
        price: props.price ?? Number(faker.commerce.price({ min: 100, max: 2000, dec: 2 })),
        quantity: props.quantity ?? faker.number.int({ min: 1, max: 1000 }),
    };
}

export function createProductInputBuilder(props: Partial<CreateProductInput>): CreateProductInput {
    return productInputBuilder({ ...props });
}

export function updateProductInputBuilder(props: Partial<UpdateProductInput>): Required<UpdateProductInput> {
    return {
        id: props.id ?? randomUUID(),
        ...createProductInputBuilder({ ...props })
    };
}