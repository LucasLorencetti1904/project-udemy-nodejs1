import HttpError, { BadRequestError, InternalError, NotFoundError } from "@/common/domain/errors/httpErrors";
import type ProductModel from "@/products/domain/models/ProductModel";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";

export default abstract class ProductUseCase {
    constructor(
        protected readonly repo: ProductRepository
    ) {}    

    protected handleApplicationErrors(e: unknown) {
        if (e instanceof HttpError) {
            throw e;
        }
        throw new InternalError(e instanceof Error ? e.message : String(e));
    }

    protected async tryGetById(id: string): Promise<ProductModel> {
        const product: ProductModel = await this.repo.findById(id);

        if (!product) {
            throw new NotFoundError("Product not found by ID.");
        }

        return product;
    }
}