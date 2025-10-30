import { inject, injectable } from "tsyringe";
import { BadRequestError, NotFoundError } from "@/common/domain/errors/httpErrors";
import type GetProductByIdUseCase from "@/products/application/usecases/getProductById/GetProductByIdUseCase";
import type ProductOutput from "@/products/application/usecases/default/ProductOutput";
import type GetProductByIdInput from "@/products/application/usecases/getProductById/GetProductByIdInput";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type ProductModel from "@/products/domain/models/ProductModel";
import ReadProductUseCase from "@/products/application/usecases/default/ReadProductUseCase";

@injectable()
export default class GetProductByIdUseCaseImpl extends ReadProductUseCase implements GetProductByIdUseCase {
    constructor(
        @inject("ProductRepository")
        protected readonly repo: ProductRepository
    ) { super(repo) }

    public async execute(input: GetProductByIdInput): Promise<ProductOutput> {
        try {
            this.checkId(input);

            return await this.tryGetById(input);
        }
        catch (e: unknown) {
            this.handleApplicationErrors(e);
        }
    }
}