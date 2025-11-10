import { faker } from "@faker-js/faker";
import { ProductInput, ProductOutput } from "@/products/application/dto/productIo";
import CreateProductInput from "@/products/application/dto/CreateProductInput";
import UpdateProductInput from "@/products/application/dto/UpdateProductInput";
import { randomUUID } from "node:crypto";
import ProductModel from "@/products/domain/models/ProductModel";

export default class TestingProductFactory {
    public static input(props: Partial<ProductInput>): ProductInput {
        return {
            name: props.name ?? faker.commerce.productName(),
            price: props.price ?? Number(faker.commerce.price({ min: 100, max: 2000, dec: 2 })),
            quantity: props.quantity ?? faker.number.int({ min: 1, max: 1000 })
        };
    }

    public static createInput(props: Partial<CreateProductInput>): CreateProductInput {
        return {
            name: props.name ?? faker.commerce.productName(),
            price: props.price ?? Number(faker.commerce.price({ min: 100, max: 2000, dec: 2 })),
            quantity: props.quantity ?? faker.number.int({ min: 1, max: 1000 })
        };
    }

    public static updateInput(props: Partial<UpdateProductInput>): UpdateProductInput {
        return {
            id: props.id ?? randomUUID(),
            name: props.name ?? faker.commerce.productName(),
            price: props.price ?? Number(faker.commerce.price({ min: 100, max: 2000, dec: 2 })),
            quantity: props.quantity ?? faker.number.int({ min: 1, max: 1000 })
        };
    }

    public static model(props: Partial<ProductModel>): ProductModel {
        return {
            id: props.id ?? randomUUID(),
            name: props.name ?? faker.commerce.productName(),
            price: props.price ?? Number(faker.commerce.price({ min: 100, max: 2000, dec: 2 })),
            quantity: props.quantity ?? faker.number.int({ min: 1, max: 1000 }),
            createdAt: props.createdAt ?? new Date(),
            updatedAt: props.updatedAt ?? new Date()
        };
    }

    public static output(props: Partial<ProductOutput>): ProductOutput {
        return {
            id: props.id ?? randomUUID(),
            name: props.name ?? faker.commerce.productName(),
            price: props.price ?? Number(faker.commerce.price({ min: 100, max: 2000, dec: 2 })),
            quantity: props.quantity ?? faker.number.int({ min: 1, max: 1000 }),
            createdAt: props.createdAt ?? new Date(),
            updatedAt: props.updatedAt ?? new Date()
        };
    }
}