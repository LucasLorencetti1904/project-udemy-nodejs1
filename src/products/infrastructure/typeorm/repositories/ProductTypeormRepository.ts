import ProductRepository, { CreateProductProps, ProductId } from "@/products/domain/repositories/ProductRepository";
import { In, Repository } from "typeorm";
import Product from "@/products/infrastructure/typeorm/entities/Product";
import { dataSource } from "@/common/infrastructure/typeorm/dataSource";
import ProductModel from "@/products/domain/models/ProductModel";
import { NotFoundError } from "@/common/domain/errors/httpErrors";

export default class ProductTypeormRepository {
    public sortableFields: string[] = ["name", "createdAt"];

    constructor (
        private readonly productRepository: Repository<Product> = dataSource.getRepository(Product)
    ){}

    public async findById(id: string): Promise<ProductModel> {
        return await this._getById(id);
    }

    public async findAllByIds(productIds: ProductId[]): Promise<ProductModel[]> {
        return await this.productRepository.find({ where: { id: In(productIds) } });
    }

    public async findByName(name: string): Promise<ProductModel> {
        const product: ProductModel = await this.productRepository.findOneBy({ name });

        if (!product) {
            throw new NotFoundError(`Product not found with name: ${name}.`);
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
        return await this.productRepository.save(toUpdate);
    }

    public async delete(id: string): Promise<void> {
        const toDelete: ProductModel = await this._getById(id);
        await this.productRepository.delete({ id: toDelete.id });
    }

    protected async _getById(id: string): Promise<ProductModel> {
        const product: ProductModel = await this.productRepository.findOneBy({ id });

        if (!product) {
            throw new NotFoundError(`Product not found with ID ${id}.`);
        }

        return product;
    }
}