import { inject, injectable } from "tsyringe";
import { ILike, In, Repository } from "typeorm";
import type ProductRepository from "@/products/infrastructure/typeorm/repositories/ProductTypeormRepository"
import type { RepositorySearchInput, RepositorySearchOutput } from "@/common/domain/repositories/repositoryIo";
import type Product from "@/products/infrastructure/typeorm/entities/Product";
import type ProductModel from "@/products/domain/models/ProductModel";
import TypeormRepository from "@/common/infrastructure/repositories/TypeormRepository";

@injectable()
export default class ProductTypeormRepository extends TypeormRepository<Product>
    implements ProductRepository {
        public sortableFields: string[] = ["name", "createdAt"]; 

        constructor (
            @inject("ProductDefaultTypeormRepository")
            protected readonly productRepository: Repository<Product>
        ) { super(productRepository) }

        public async findAllByIds(productIds: string[]): Promise<ProductModel[]> {
            return await this.productRepository.find({ where: { id: In(productIds) } });
        }

        public async findByName(name: string): Promise<ProductModel | null> {
            return await this.productRepository.findOneBy({ name });
        }

        public async search(config: RepositorySearchInput<ProductModel>): Promise<RepositorySearchOutput<ProductModel>> {
                const input = this.setDefaultValuesForInvalidSearchInputProps(config, {
                    page: 1,
                    perPage: 15,
                    sort: "createdAt",
                    sortDir: "desc",
                    filter: ""
                });

                const searchResult: [ProductModel[], number] = await this.userRepository.findAndCount({
                    ...(input.filter && { where: { name: ILike(`%${input.filter}%`) } }),
                    order: { [input.sort]: input.sortDir },
                    skip: (input.page - 1) * input.perPage,
                    take: input.perPage
                });

                return this.mapToSearchOutput(searchResult, input);
        }
}