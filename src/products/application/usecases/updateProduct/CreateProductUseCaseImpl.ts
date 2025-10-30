import { inject, injectable } from "tsyringe";
import HttpError, { BadRequestError, ConflictError, InternalError } from "@/common/domain/errors/httpErrors";
import type CreateProductInput from "@/products/application/usecases/createProduct/CreateProductInput";
import type ProductOutput from "@/products/application/usecases/default/ProductOutput";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type ProductModel from "@/products/domain/models/ProductModel";
import type UpdateProductInput from "@/products/application/usecases/updateProduct/UpdateProductInput";
import type UpdateProductUseCase from "@/products/application/usecases/updateProduct/UpdateProductUseCase";

@injectable()
export default class UpdateProductUseCaseImpl implements UpdateProductUseCase {
    constructor(
        @inject("ProductRepository")
        private readonly repo: ProductRepository
    ) {}

    public async execute(input: UpdateProductInput): Promise<ProductOutput> {
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
            if (e instanceof HttpError) {
                throw e;
            }
            throw new InternalError(e instanceof Error ? e.message : String(e));
        }
    }

    private async nameAlreadyExists(name: string): Promise<boolean> {
        return !!(await this.repo.findByName(name));
    }

    private someInvalidField(input: CreateProductInput): boolean {
        return !input.name || input.price <= 0 || input.quantity <= 0;
    }
}