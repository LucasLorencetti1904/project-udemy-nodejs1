import { inject, injectable } from "tsyringe";
import ProductUseCase from "@/products/application/usecases/default/ProductUseCase";
import ApplicationHandler from "@/common/application/helpers/ApplicationHandler";
import type DeleteProductByIdUseCase from "@/products/application/usecases/deleteProductById/DeleteProductByIdUseCase";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type ProductModel from "@/products/domain/models/ProductModel";
import type DeleteProductByIdInput from "@/products/application/dto/DeleteProductByIdInput";
import type { ProductOutput } from "@/products/application/dto/productIo";
import { NotFoundError } from "@/common/domain/errors/httpErrors";

@injectable()
export default class DeleteProductByIdUseCaseImpl extends ProductUseCase implements DeleteProductByIdUseCase {
    constructor(
        @inject("ProductRepository")
        protected readonly repo: ProductRepository
    ) { super(repo); }

    public async execute(input: DeleteProductByIdInput): Promise<ProductOutput> {
        try {
            const toDelete: ProductModel = await this.repo.delete(input);

            if (!toDelete) {
                throw new NotFoundError("Product not found by ID.");
            }

            return toDelete;
        }
        catch (e: unknown) {
            ApplicationHandler.handleErrors(e);
        }
    }
}