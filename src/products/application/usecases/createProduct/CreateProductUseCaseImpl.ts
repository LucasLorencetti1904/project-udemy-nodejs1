import { inject, injectable } from "tsyringe";
import { BadRequestError, ConflictError } from "@/common/domain/errors/httpErrors";
import type CreateProductUseCase from "@/products/application/usecases/createProduct/CreateProductUseCase";
import type CreateProductInput from "@/products/application/usecases/createProduct/CreateProductIoDto";
import type ProductOutput from "@/products/application/ProductOutput";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type ProductModel from "@/products/domain/models/ProductModel";

@injectable()
export default class CreateProductUseCaseImpl implements CreateProductUseCase {
    constructor(
        @inject("ProductRepository")
        private readonly repo: ProductRepository
    ) {}

    public async execute(input: CreateProductInput): Promise<ProductOutput> {
        if (this.someInvalidField(input)) {
            throw new BadRequestError("Input data not provided or invalid.");
        }

        if (await this.nameAlreadyExists(input.name)) {
            throw new ConflictError(`Product name ${input.name} already exists.`);
        }

        const product: ProductModel = this.repo.create(input);
        await this.repo.insert(product);

        return product;
    }

    private async nameAlreadyExists(name: string): Promise<boolean> {
        return !!(await this.repo.findByName(name));
    }

    private someInvalidField(input: CreateProductInput): boolean {
        return !input.name || input.price <= 0 || input.quantity <= 0;
    }
}