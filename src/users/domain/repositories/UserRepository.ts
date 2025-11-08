import type Repository from "@/common/domain/repositories/Repository";
import type UserModel from "@/users/domain/models/UserModel";
import type CreateUserProps from "@/users/domain/repositories/CreateUserProps";

export default interface UserRepository extends Repository<UserModel, CreateUserProps> {
    findByEmail(email: string): Promise<UserModel | null>;
    findByName(name: string): Promise<UserModel[]>;
}