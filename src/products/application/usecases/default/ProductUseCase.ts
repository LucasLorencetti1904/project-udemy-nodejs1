import BaseUseCase from "@/common/application/usecases/BaseUseCase";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type ProductModel from "@/products/domain/models/ProductModel";
import { ConflictError, NotFoundError } from "@/common/domain/errors/httpErrors";

export default abstract class ProductUseCase extends BaseUseCase {
    constructor(
        protected readonly repo: ProductRepository
    ) { super(); }    

    protected async tryGetById(id: string): Promise<ProductModel> {
        const product: ProductModel = await this.repo.findById(id);

        if (!product) {
            throw new NotFoundError("Product not found by ID.");
        }

        return product;
    }

    protected async checkIfNameAlreadyExists(name: string): Promise<void> {
        if (await this.nameAlreadyExists(name)) {
            throw new ConflictError(`Product name ${name} already exists.`);
        }
    }

    private async nameAlreadyExists(name: string): Promise<boolean> {
        return !name || !!(await this.repo.findByName(name));
    }
}