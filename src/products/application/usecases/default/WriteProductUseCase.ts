import ProductUseCase from "@/products/application/usecases/default/ProductUseCase";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type ProductInput from "@/products/application/usecases/default/ProductInput";

export default abstract class WriteProductUseCase extends ProductUseCase {
    constructor(
        protected readonly repo: ProductRepository
    ) { super(repo) }

    protected async nameAlreadyExists(name: string): Promise<boolean> {
        return !!(await this.repo.findByName(name));
    }

    protected abstract someInvalidField(input: ProductInput): boolean;
}