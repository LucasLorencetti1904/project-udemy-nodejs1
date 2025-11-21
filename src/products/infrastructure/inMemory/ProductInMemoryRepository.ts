import { inject, injectable } from "tsyringe";
import type ProductModel from "@/products/domain/models/ProductModel";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type RepositoryProvider from "@/common/domain/repositories/RepositoryProvider";
import type RepositorySearchDSL from "@/common/domain/search/repositorySearcher/RepositorySearchDSL";
import type RepositorySearchResult from "@/common/domain/search/repositorySearcher/RepositorySearchResult";
import type CreateProductProps from "@/products/domain/repositories/CreateProductProps";

@injectable()
export default class ProductInMemoryRepository implements ProductRepository {
    constructor(
        @inject("RepositoryProvider<ProductModel>")
        private readonly repo: RepositoryProvider<ProductModel, CreateProductProps>
    ) {}

    public async findByName(value: string): Promise<ProductModel | null> {
        return await this.repo.findOneBy("name", value);
    }

    public async findAllByIds(productIds: string[]): Promise<ProductModel[]> {
        const products: ProductModel[] = await Promise.all(productIds.map((productId) => this.repo.findById(productId)));
        return products.filter((product) => !!product);
    }

    public async create(data: CreateProductProps): Promise<ProductModel> {
        return await this.repo.create(data);
    }

    public async findById(id: string): Promise<ProductModel> {
        return await this.repo.findById(id);
    }

    public async update(model: ProductModel): Promise<ProductModel> {
        return await this.repo.update(model);
    }

    public async delete(id: string): Promise<ProductModel> {
        return await this.repo.delete(id);
    }

    public async search(searchDsl: RepositorySearchDSL<ProductModel>): Promise<RepositorySearchResult<ProductModel>> {
        return await this.repo.search(searchDsl);
    }
}