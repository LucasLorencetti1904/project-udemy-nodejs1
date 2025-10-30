import ProductUseCase from "@/products/application/usecases/default/ProductUseCase";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";

export default abstract class ReadProductUseCase extends ProductUseCase {
    constructor(
        protected readonly repo: ProductRepository
    ) { super(repo) }
}