import ProductRepository from "@/products/domain/repositories/ProductRepository";
import { CreateProductInput, CreateProductOutput } from "../../dto/CreateProductIoDto";

export default abstract class CreateProductUseCase {
    constructor(protected readonly repo: ProductRepository) {}

    public abstract execute(data: CreateProductInput): Promise<CreateProductOutput>;

    protected async nameAlreadyExists(name: string): Promise<boolean> {
        return !!(await this.repo.findByName(name));
    }
}