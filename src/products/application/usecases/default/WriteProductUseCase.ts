import ProductUseCase from "@/products/application/usecases/default/ProductUseCase";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";

export default abstract class WriteProductUseCase extends ProductUseCase {
    constructor(
        protected readonly repo: ProductRepository
    ) { super(repo) }

    protected async nameAlreadyExists(name: string): Promise<boolean> {
        return !!(await this.repo.findByName(name));
    }
}