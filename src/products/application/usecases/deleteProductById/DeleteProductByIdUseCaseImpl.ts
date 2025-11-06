import { inject, injectable } from "tsyringe";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import DeleteProductByIdUseCase from "@/products/application/usecases/deleteProductById/DeleteProductByIdUseCase";
import type DeleteProductByIdInput from "@/products/application/dto/DeleteProductByIdInput";
import { NotFoundError } from "@/common/domain/errors/httpErrors";
import type { ProductOutput } from "@/products/application/dto/productIo";
import type ProductModel from "@/products/domain/models/ProductModel";
import ProductUseCase from "@/products/application/usecases/default/ProductUseCase";

@injectable()
export default class DeleteProductByIdUseCaseImpl extends ProductUseCase implements DeleteProductByIdUseCase {
    constructor(
        @inject("ProductRepository")
        protected readonly repo: ProductRepository
    ) { super(repo) }

    public async execute(input: DeleteProductByIdInput): Promise<ProductOutput> {
        try {
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