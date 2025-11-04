import type Repository from "@/common/domain/repositories/Repository";
import type ProductModel from "@/products/domain/models/ProductModel";
import CreateProductProps from "@/products/domain/repositories/CreateProductProps";

export default interface ProductRepository extends Repository<ProductModel, CreateProductProps> {
    findByName(name: string): Promise<ProductModel | null>;
    findAllByIds(productIds: string[]): Promise<ProductModel[]>;
}