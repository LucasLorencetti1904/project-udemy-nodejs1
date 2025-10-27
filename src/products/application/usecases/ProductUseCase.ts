import UseCase from "@/common/application/usecases/UseCase";
import ProductRepository from "@/products/domain/repositories/ProductRepository";

export default abstract class ProductUseCase extends UseCase {
    constructor(protected readonly repo: ProductRepository) {
        super();
    }

    protected async nameAlreadyExists(name: string): Promise<boolean> {
        return !!(await this.repo.findByName(name));
    }
}