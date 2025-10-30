import ProductUseCase from "@/products/application/usecases/default/ProductUseCase";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type ProductInput from "@/products/application/usecases/default/ProductInput";
import { ConflictError } from "@/common/domain/errors/httpErrors";

export default abstract class WriteProductUseCase extends ProductUseCase {
    constructor(
        protected readonly repo: ProductRepository
    ) { super(repo) }

    protected async checkIfNameAlreadyExists(name: string): Promise<void> {
        if (await this.nameAlreadyExists(name)) {
            throw new ConflictError(`Product name ${name} already exists.`);
        }
    }

    private async nameAlreadyExists(name: string): Promise<boolean> {
        return !name || !!(await this.repo.findByName(name));
    }

    protected abstract someInvalidField(input: ProductInput): boolean;
}