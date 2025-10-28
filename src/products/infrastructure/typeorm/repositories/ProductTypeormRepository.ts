import ProductRepository, { CreateProductProps, ProductId } from "@/products/domain/repositories/ProductRepository";
import { ILike, In, Repository } from "typeorm";
import Product from "@/products/infrastructure/typeorm/entities/Product";
import dataSource from "@/common/infrastructure/typeorm/config/dataSource";
import ProductModel from "@/products/domain/models/ProductModel";
import { SearchInput, SearchOutput } from "@/common/domain/repositories/Repository";

export default class ProductTypeormRepository implements ProductRepository {
    public sortableFields: string[] = ["name", "createdAt"];

    constructor (
        private readonly productRepository: Repository<Product> = dataSource.getRepository(Product)
    ){}

    public async findById(id: string): Promise<ProductModel | null> {
        return await this._getById(id);
    }

    public async findAllByIds(productIds: ProductId[]): Promise<ProductModel[]> {
        return await this.productRepository.find({ where: { id: In(productIds) } });
    }

    public async findByName(name: string): Promise<ProductModel | null> {
        const product: ProductModel = await this.productRepository.findOneBy({ name });

        if (!product) {
            return null;
        }

        return product;
    }

    public create(data: CreateProductProps): ProductModel {
        return this.productRepository.create(data);
    }

    public async insert(model: ProductModel): Promise<ProductModel> {
        return await this.productRepository.save(model);
    }

    public async update(model: ProductModel): Promise<ProductModel> {
        const toUpdate: ProductModel = await this._getById(model.id);

        if (!toUpdate) {
            return model;
        }

        return await this.productRepository.save(toUpdate);
    }

    public async delete(id: string): Promise<ProductModel | null> {
        const toDelete: ProductModel = await this._getById(id);

        if (!toDelete) {
            return null;
        }

        await this.productRepository.delete({ id: toDelete.id });
        return toDelete;
    }

    protected async _getById(id: string): Promise<ProductModel | null> {
        const product: ProductModel = await this.productRepository.findOneBy({ id });

        if (!product) {
            return null;
        }

        return product;
    }

    public async search(config: SearchInput): Promise<SearchOutput<ProductModel>> {
        config.page = config.page ?? 1;
        config.perPage = config.perPage ?? 15;
    
        if (!this.sortableFields.includes(config.sort)) {
            config.sort = "createdAt";
        }

        if (!["asc", "desc"].includes(config.sortDir)) {
            config.sortDir = "desc";
        }

        const [products, count]: [ProductModel[], number] = await this.productRepository.findAndCount({
            ...(config.filter && { where: { name: ILike(`%${config.filter}%`) } }),
            order: { [config.sort]: config.sortDir },
            skip: (config.page - 1) * config.perPage,
            take: config.perPage
        });

        return {
            items: products,
            total: count,
            currentPage: config.page,
            perPage: config.perPage,
            filter: config.filter,
            sort: config.sort,
            sortDir: config.sortDir
        }
    }
}