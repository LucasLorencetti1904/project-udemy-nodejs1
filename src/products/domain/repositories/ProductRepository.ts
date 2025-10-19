import Repository from "@/common/domain/repositories/Repository";
import ProductModel from "@/products/domain/models/ProductModel";

export type CreateProductProps = {
    name: string,
    price: number,
    quantity: number
};

export type ProductId = {
    id: string
};

export default interface ProductRepository extends Repository<ProductModel, CreateProductProps> {
    findByName(name: string): Promise<ProductModel>;
    findAllByIds(productIds: ProductId[]): Promise<ProductModel[]>;
}