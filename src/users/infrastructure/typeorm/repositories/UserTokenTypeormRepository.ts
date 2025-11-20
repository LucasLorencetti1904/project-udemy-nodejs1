import { inject, injectable } from "tsyringe";
import TypeormRepository from "@/common/infrastructure/repositories/TypeormRepository";
import type UserTokenRepository from "@/users/domain/repositories/userTokenRepository/UserTokenRepository";
import type { Repository } from "typeorm";
import type User from "@/users/infrastructure/typeorm/entities/User";
import type UserModel from "@/users/domain/models/UserModel";
import type UserTokenModel from "@/users/domain/models/UserTokenModel";
import type { RepositorySearchInput } from "@/common/infrastructure/repositories/repositorySearchIo";

@injectable()
export default class UserTokenTypeormRepository extends TypeormRepository<UserTokenModel>
    implements UserTokenRepository {
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