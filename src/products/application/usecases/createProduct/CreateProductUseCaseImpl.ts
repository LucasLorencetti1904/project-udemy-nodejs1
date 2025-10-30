import { inject, injectable } from "tsyringe";
import { BadRequestError, ConflictError } from "@/common/domain/errors/httpErrors";
import type CreateProductUseCase from "@/products/application/usecases/createProduct/CreateProductUseCase";
import WriteProductUseCase from "@/products/application/usecases/default/WriteProductUseCase";
import type CreateProductInput from "@/products/application/usecases/createProduct/CreateProductInput";
import type ProductOutput from "@/products/application/usecases/default/ProductOutput";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type ProductModel from "@/products/domain/models/ProductModel";

@injectable()
export default class CreateProductUseCaseImpl extends WriteProductUseCase implements CreateProductUseCase {
    constructor(
        @inject("ProductRepository")
        protected readonly repo: ProductRepository
    ) { super(repo) }

    public async execute(input: CreateProductInput): Promise<ProductOutput> {
        if (this.someInvalidField(input)) {
            throw new BadRequestError("Input data not provided or invalid.");
        }

        try {
            if (await this.nameAlreadyExists(input.name)) {
                throw new ConflictError(`Product name ${input.name} already exists.`);
            }

            const product: ProductModel = this.repo.create(input);
            await this.repo.insert(product);

            return product;
        }
        catch (e: unknown) {
            this.handleApplicationErrors(e);
        }
    }
}