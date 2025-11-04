import InMemoryRepository from "@/common/domain/repositories/InMemoryRepository";
import Repository from "@/common/domain/repositories/Repository";
import UserModel from "@/users/domain/models/UserModel";

export default class UserInMemoryRepository extends InMemoryRepository<UserModel> implements Repository {
    
}