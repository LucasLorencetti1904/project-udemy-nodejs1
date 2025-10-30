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

    protected checkId(id: string): void {
        if (this.isInvalidId(id)) {
            throw new BadRequestError("ID not provided or invalid.");
        }
    }
    
    private isInvalidId(id: string): boolean {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return !regex.test(id);
    }
}