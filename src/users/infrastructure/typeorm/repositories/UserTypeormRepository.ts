import { inject, injectable } from "tsyringe";
import TypeormRepository from "@/common/infrastructure/repositories/TypeormRepository";
import type UserRepository from "@/users/domain/repositories/userRepository/UserRepository"
import type { Repository } from "typeorm";
import type User from "@/users/infrastructure/typeorm/entities/User";
import type UserModel from "@/users/domain/models/UserModel";
import type { RepositorySearchInput } from "@/common/domain/repositories/repositorySearchIo";

@injectable()
export default class UserTypeormRepository extends TypeormRepository<UserModel>
    implements UserRepository {
        protected readonly defaultSearchValues: RepositorySearchInput<UserModel> = {
            page: 1,
            perPage: 15,
            sort: "createdAt",
            sortDir: "desc",
            filter: ""
        };

        protected readonly sortableFields: string[] = ["name", "email", "createdAt"];

        constructor (
            @inject("UserDefaultTypeormRepository")
            protected readonly userRepository: Repository<User>
        ) { super(userRepository); }

        public async findByName(name: string): Promise<UserModel[]> {
            return await this.userRepository.findBy({ name });
        }

        public async findByEmail(email: string): Promise<UserModel | null> {
            return await this.userRepository.findOneBy({ email });
        }
}