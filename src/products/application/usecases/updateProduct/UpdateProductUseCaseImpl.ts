import { inject, injectable } from "tsyringe";
import { BadRequestError } from "@/common/domain/errors/httpErrors";
import type ProductOutput from "@/products/application/usecases/default/ProductOutput";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type ProductModel from "@/products/domain/models/ProductModel";
import type UpdateProductInput from "@/products/application/usecases/updateProduct/UpdateProductInput";
import type UpdateProductUseCase from "@/products/application/usecases/updateProduct/UpdateProductUseCase";
import WriteProductUseCase from "@/products/application/usecases/default/WriteProductUseCase";

@injectable()
export default class UpdateProductUseCaseImpl extends WriteProductUseCase implements UpdateProductUseCase {
    constructor(
        @inject("ProductRepository")
        protected readonly repo: ProductRepository
    ) { super(repo) }

    public async execute(input: UpdateProductInput): Promise<ProductOutput> { 
        try {
            this.checkId(input.id);

            if (this.someInvalidField(input)) {
                throw new BadRequestError("Input data not provided or invalid.");
            }
            
            await this.checkIfNameAlreadyExists(input.name);

            const toUpdate: ProductModel = await this.tryGetById(input.id);

            return await this.repo.update(toUpdate);
        }
        catch (e: unknown) {
            this.handleApplicationErrors(e);
        }
    }

    protected someInvalidField(input: UpdateProductInput): boolean {
        return this.isDefinedAndNotPositive(input.price)
            || this.isDefinedAndNotPositive(input.quantity);
    }

    private isDefinedAndNotPositive(n: number): boolean {
        return n != undefined && n <= 0;
    }
}