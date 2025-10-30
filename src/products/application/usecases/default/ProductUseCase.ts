import HttpError, { InternalError } from "@/common/domain/errors/httpErrors";
import type ProductModel from "@/products/domain/models/ProductModel";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type ProductInput from "@/products/application/usecases/default/ProductInput";
import uuidValidate from "uuid";

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

    protected async getById(id: string): Promise<ProductModel> {
        return await this.repo.findById(id);
    }

    protected someInvalidField(input: ProductInput): boolean {
        return !input.name || input.price <= 0 || input.quantity <= 0;
    }

    protected isInvalidId(id: string) {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return !regex.test(id);
    }
}