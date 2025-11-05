import type Repository from "@/common/domain/repositories/Repository";
import UserModel from "@/users/domain/models/UserModel";
import CreateUserProps from "@/users/domain/repository/CreateUserProps"

export default interface UserRepository extends Repository<UserModel, CreateUserProps> {
    findByEmail(email: string): Promise<UserModel | null>;
    findByName(name: string): Promise<UserModel[]>;
}