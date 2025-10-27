import { BadRequestError, ConflictError } from "@/common/domain/errors/httpErrors";
import ProductUseCase from "@/products/application/usecases/ProductUseCase";
import ProductModel from "@/products/domain/models/ProductModel";
import { CreateProductInput, CreateProductOutput } from "@/products/application/dto/CreateProductIoDto";

export class CreateProductUseCase extends ProductUseCase {
    public async execute(input: CreateProductInput): Promise<CreateProductOutput> {
        if (this.someInvalidField(input)) {
            throw new BadRequestError("Input data not provided or invalid.");
        }

        if (await this.nameAlreadyExists(input.name)) {
            throw new ConflictError(`Product name ${input.name} already exists.`);
        }

        const product: ProductModel = this.repo.create(input);
        await this.repo.insert(product);

        return product;
    }

    private someInvalidField(input: CreateProductInput): boolean {
        return !input.name || input.price <= 0 || input.quantity <= 0;
    }
}