import { inject, injectable } from "tsyringe";
import type ProductRepository from "@/products/domain/repositories/ProductRepository"
import type ProductModel from "@/products/domain/models/ProductModel";
import type CreateProductProps from "@/products/domain/repositories/CreateProductProps";
import type RepositoryProvider from "@/common/domain/repositories/RepositoryProvider";
import type RepositorySearchResult from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchResult";
import type RepositorySearchDSL from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchDSL";

@injectable()
export default class ProductTypeormRepository implements ProductRepository {
    constructor (
        @inject("RepositoryProvider<Product>")
        private readonly repo: RepositoryProvider<ProductModel, CreateProductProps>
    ){}

        public async findAllByIds(productIds: string[]): Promise<ProductModel[]> {
        const products: ProductModel[] = await Promise.all(productIds.map((productId) => this.repo.findById(productId)));
        return products.filter((product) => !!product);
    }

        public async findByName(value: string): Promise<ProductModel | null> {
            return await this.repo.findOneBy("name", value);
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

        public async search(dslQuery: RepositorySearchDSL<ProductModel>): Promise<RepositorySearchResult<ProductModel>> {
            return await this.repo.search(dslQuery);
        }
}