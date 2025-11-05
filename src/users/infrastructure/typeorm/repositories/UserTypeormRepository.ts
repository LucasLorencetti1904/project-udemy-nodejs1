import { inject, injectable } from "tsyringe";
import { ILike, Repository } from "typeorm";
import type UserRepository from "@/users/domain/repository/UserRepository"
import type { RepositorySearchInput, RepositorySearchOutput } from "@/common/domain/repositories/repositoryIo";
import type User from "@/users/infrastructure/typeorm/entities/User";
import type UserModel from "@/users/domain/models/UserModel";
import TypeormRepository from "@/common/infrastructure/repositories/TypeormRepository";

@injectable()
export default class UserTypeormRepository extends TypeormRepository<UserModel> implements UserRepository {
    public sortableFields: string[] = ["name", "email", "createdAt"]; 
    constructor (
        @inject("UserDefaultTypeormRepository")
        protected readonly userRepository: Repository<User>
    ) { super(userRepository) }

    public async findByName(name: string): Promise<UserModel[]> {
        return await this.userRepository.findBy({ name });
    }

    public async findByEmail(email: string): Promise<UserModel | null> {
        return await this.userRepository.findOneBy({ email });
    }

    public async search(config: RepositorySearchInput<UserModel>): Promise<RepositorySearchOutput<UserModel>> {
            const input = this.setDefaultValuesForInvalidSearchInputProps(config, {
                page: 1,
                perPage: 15,
                sort: "createdAt",
                sortDir: "desc",
                filter: ""
            });

            const searchResult: [UserModel[], number] = await this.userRepository.findAndCount({
                ...(input.filter && { where: { name: ILike(`%${input.filter}%`) } }),
                order: { [input.sort]: input.sortDir },
                skip: (input.page - 1) * input.perPage,
                take: input.perPage
            });

            return this.mapToSearchOutput(searchResult, input);
    }
}