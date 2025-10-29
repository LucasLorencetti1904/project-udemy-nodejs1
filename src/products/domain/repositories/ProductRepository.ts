import type Repository from "@/common/domain/repositories/Repository";
import type ProductModel from "@/products/domain/models/ProductModel";

export type CreateProductProps = {
    name: string,
    price: number,
    quantity: number
};

export default interface ProductRepository extends Repository<ProductModel, CreateProductProps> {
    findByName(name: string): Promise<ProductModel | null>;
    findAllByIds(productIds: string[]): Promise<ProductModel[]>;
}