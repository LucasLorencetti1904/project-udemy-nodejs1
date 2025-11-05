import { inject, injectable } from "tsyringe";
import { ILike, Repository } from "typeorm";
import type UserRepository from "@/users/domain/repository/UserRepository"
import type CreateUserProps from "@/users/domain/repository/CreateUserProps";
import type { RepositorySearchInput, RepositorySearchOutput } from "@/common/domain/repositories/repositoryIo";
import type User from "@/users/infrastructure/typeorm/entities/User";
import type UserModel from "@/users/domain/models/UserModel";

@injectable()
export default class UserTypeormRepository implements UserRepository {
    public sortableFields: string[] = ["name", "email", "createdAt"]; 
    constructor (
        @inject("UserDefaultTypeormRepository")
        private userRepository: Repository<User>
    ) {}

    public async findById(id: string): Promise<UserModel | null> {
        return await this._getById(id);
    }

    public async findByName(name: string): Promise<UserModel[]> {
        return await this.userRepository.findBy({ name });
    }

    public async findByEmail(email: string): Promise<UserModel | null> {
        return await this.userRepository.findOneBy({ email });
    }

    public create(data: CreateUserProps): UserModel {
        return this.userRepository.create(data);
    }

    public async insert(model: UserModel): Promise<UserModel> {
        return await this.userRepository.save(model);
    }

    public async update(model: UserModel): Promise<UserModel> {
        const toUpdate: UserModel = await this._getById(model.id);

        if (!toUpdate) {
            return model;
        }

        return await this.userRepository.save({ ...toUpdate, ...model });
    }

    public async delete(id: string): Promise<UserModel | null> {
        const toDelete: UserModel = await this._getById(id);

        if (!toDelete) {
            return null;
        }

        await this.userRepository.delete({ id: toDelete.id });
        return toDelete;
    }

    protected async _getById(id: string): Promise<UserModel | null> {
        const user: UserModel = await this.userRepository.findOneBy({ id });

        if (!user) {
            return null;
        }

        return user;
    }

    public async search(config: RepositorySearchInput<UserModel>): Promise<RepositorySearchOutput<UserModel>> {
        const setDefaultIfInvalid = (n: number, def: number): number => {
            return !n || n < 1|| !Number.isInteger(n) ? def : n;
        };

        config.page = setDefaultIfInvalid(config.page, 1);
        config.perPage = setDefaultIfInvalid(config.perPage, 15);
        config.filter = config.filter ?? "";

        if (!this.sortableFields.includes(config.sort)) {
            config.sort = "createdAt";
        }

        if (!["asc", "desc"].includes(config.sortDir)) {
            config.sortDir = "desc";
        }

        const [users, count]: [UserModel[], number] = await this.userRepository.findAndCount({
            ...(config.filter && { where: { name: ILike(`%${config.filter}%`) } }),
            order: { [config.sort]: config.sortDir },
            skip: (config.page - 1) * config.perPage,
            take: config.perPage
        });

        return {
            items: users,
            total: count,
            currentPage: config.page,
            perPage: config.perPage,
            filter: config.filter,
            sort: config.sort,
            sortDir: config.sortDir
        }
    }
}