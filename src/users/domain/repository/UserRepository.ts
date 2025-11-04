import type Repository from "@/common/domain/repositories/Repository";
import type ProductModel from "@/products/domain/models/ProductModel";
import UserModel from "@/users/domain/models/UserModel";

export type CreateUserProps = {
    name: string,
    email: string,
    password: string
};

export default interface ProductRepository extends Repository<UserModel, CreateUserProps> {
    findByEmail(email: string): Promise<ProductModel | null>;
    findByName(name: string): Promise<ProductModel[]>;
}