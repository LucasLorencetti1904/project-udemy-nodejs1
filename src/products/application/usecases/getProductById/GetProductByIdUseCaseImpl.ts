import { inject, injectable } from "tsyringe";
import HttpError, { InternalError, NotFoundError } from "@/common/domain/errors/httpErrors";
import type GetProductByIdUseCase from "@/products/application/usecases/getProductById/GetProductByIdUseCase";
import type ProductOutput from "@/products/application/ProductOutput";
import type GetProductByIdInput from "@/products/application/usecases/getProductById/GetProductByIdInput";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type ProductModel from "@/products/domain/models/ProductModel";

@injectable()
export default class GetProductByIdUseCaseImpl implements GetProductByIdUseCase {
    constructor(
        @inject("ProductRepository")
        private readonly repo: ProductRepository
    ) {}

    public async execute(input: GetProductByIdInput): Promise<ProductOutput> {
        try {
            const product: ProductModel = await this.getById(input);

            if (!product) {
                throw new NotFoundError("Product not found by ID.");
            }

            return product;
        }
        catch (e: unknown) {
            if (e instanceof HttpError) {
                throw e;
            }
            throw new InternalError(e instanceof Error ? e.message : String(e));
        }
    }

    private async getById(id: string): Promise<ProductModel> {
        return await this.repo.findById(id);
    }
}