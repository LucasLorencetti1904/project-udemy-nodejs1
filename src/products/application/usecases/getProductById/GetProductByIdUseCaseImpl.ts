import { inject, injectable } from "tsyringe";
import ProductUseCase from "@/products/application/usecases/default/ProductUseCase";
import ApplicationHandler from "@/common/application/helpers/ApplicationHandler";
import type GetProductByIdUseCase from "@/products/application/usecases/getProductById/GetProductByIdUseCase";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type GetProductByIdInput from "@/products/application/dto/GetProductByIdInput";
import type { ProductOutput } from "@/products/application/dto/productIo";

@injectable()
export default class GetProductByIdUseCaseImpl extends ProductUseCase implements GetProductByIdUseCase {
    constructor(
        @inject("ProductRepository")
        protected readonly repo: ProductRepository
    ) { super(repo); }

    public async execute(input: GetProductByIdInput): Promise<ProductOutput> {
        try {
            return await this.tryGetById(input);
        }
        catch (e: unknown) {
            ApplicationHandler.handleErrors(e);
        }
    }
}