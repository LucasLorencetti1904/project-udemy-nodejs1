import { inject, injectable } from "tsyringe";
import ProductUseCase from "@/products/application/usecases/default/ProductUseCase";
import type CreateProductUseCase from "@/products/application/usecases/createProduct/CreateProductUseCase";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type ProductModel from "@/products/domain/models/ProductModel";
import type CreateProductInput from "@/products/application/dto/CreateProductInput";
import type { ProductOutput } from "@/products/application/dto/productIo";
import { BadRequestError } from "@/common/domain/errors/httpErrors";

@injectable()
export default class CreateProductUseCaseImpl extends ProductUseCase implements CreateProductUseCase {
    constructor(
        @inject("ProductRepository")
        protected readonly repo: ProductRepository
    ) { super(repo); }

    public async execute(input: CreateProductInput): Promise<ProductOutput> {
        if (this.someInvalidField(input)) {
            throw new BadRequestError("Input data not provided or invalid.");
        }

        try {
            await this.checkIfNameAlreadyExists(input.name);

            return await this.repo.create(input);
        }
        catch (e: unknown) {
            this.handleApplicationErrors(e);
        }
    }

    protected someInvalidField(input: CreateProductInput): boolean {
        return !input.name || input.price <= 0 || input.quantity <= 0;
    }
}