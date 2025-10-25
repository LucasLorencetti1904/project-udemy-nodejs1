import ProductRepository from "@/products/domain/repositories/ProductRepository";
import { Repository } from "typeorm";
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

    protected async _getById(id: string): Promise<ProductModel> {
        const product: ProductModel = await this.productRepository.findOneBy({ id });

        if (!product) {
            throw new NotFoundError("Product not found.");
        }

        return product;
    }
}