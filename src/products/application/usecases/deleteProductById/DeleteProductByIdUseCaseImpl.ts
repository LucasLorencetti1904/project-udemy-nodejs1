import { inject, injectable } from "tsyringe";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import ReadProductUseCase from "@/products/application/usecases/default/ReadProductUseCase";
import DeleteProductByIdUseCase from "@/products/application/usecases/deleteProductById/DeleteProductByIdUseCase";
import type DeleteProductByIdInput from "@/products/application/usecases/deleteProductById/DeleteProductByIdInput";
import { NotFoundError } from "@/common/domain/errors/httpErrors";
import type { ProductOutput } from "@/products/application/usecases/default/productIo";
import type ProductModel from "@/products/domain/models/ProductModel";

@injectable()
export default class DeleteProductByIdUseCaseImpl extends ReadProductUseCase implements DeleteProductByIdUseCase {
    constructor(
        @inject("ProductRepository")
        protected readonly repo: ProductRepository
    ) { super(repo) }

    public async execute(input: DeleteProductByIdInput): Promise<ProductOutput> {
        try {
            this.checkId(input);

            const toDelete: ProductModel = await this.repo.delete(input);

            if (!toDelete) {
                throw new NotFoundError("Product not found by ID.");
            }

            return toDelete;
        }
        catch (e: unknown) {
            this.handleApplicationErrors(e);
        }
    }
}