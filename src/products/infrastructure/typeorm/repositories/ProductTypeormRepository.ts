import { inject, injectable } from "tsyringe";
import TypeormRepository from "@/common/infrastructure/repositories/TypeormRepository";
import type ProductRepository from "@/products/infrastructure/typeorm/repositories/ProductTypeormRepository"
import type { RepositorySearchInput } from "@/common/domain/repositories/repositorySearchIo";
import type Product from "@/products/infrastructure/typeorm/entities/Product";
import type ProductModel from "@/products/domain/models/ProductModel";
import { In, Repository } from "typeorm";

@injectable()
export default class ProductTypeormRepository extends TypeormRepository<ProductModel>
    implements ProductRepository {
        protected readonly defaultSearchValues: RepositorySearchInput<ProductModel> = {
            page: 1,
            perPage: 15,
            sort: "createdAt",
            sortDir: "desc",
            filter: ""
        };

        protected readonly sortableFields: string[] = ["name", "createdAt"]; 

        constructor (
            @inject("ProductDefaultTypeormRepository")
            protected readonly productRepository: Repository<Product>
        ) { super(productRepository); }

        public async findAllByIds(productIds: string[]): Promise<ProductModel[]> {
            return await this.productRepository.find({ where: { id: In(productIds) } });
        }

        public async findByName(name: string): Promise<ProductModel | null> {
            return await this.productRepository.findOneBy({ name });
        }
}