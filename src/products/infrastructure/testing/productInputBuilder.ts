import { faker } from "@faker-js/faker";
import type CreateProductInput from "@/products/application/usecases/createProduct/CreateProductInput";
import type ProductModel from "@/products/domain/models/ProductModel";

export default function createProductInputBuilder(props: Partial<ProductModel>): CreateProductInput {
    return {
        name: props.name ?? faker.commerce.productName(),
        price: props.price ?? Number(faker.commerce.price({ min: 100, max: 2000, dec: 2 })),
        quantity: props.quantity ?? faker.number.int({ min: 1, max: 1000 }),
    };
}