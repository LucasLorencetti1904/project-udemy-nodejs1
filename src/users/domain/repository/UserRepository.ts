import type Repository from "@/common/domain/repositories/Repository";
import UserModel from "@/users/domain/models/UserModel";

export type CreateUserProps = {
    name: string,
    email: string,
    password: string
};

export default interface ProductRepository extends Repository<UserModel, CreateUserProps> {
    findByEmail(email: string): Promise<UserModel | null>;
    findByName(name: string): Promise<UserModel[]>;
}