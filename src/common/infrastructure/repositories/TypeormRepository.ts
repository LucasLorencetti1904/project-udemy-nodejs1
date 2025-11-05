import { Repository as BaseTypeormRepository, DeepPartial, FindOptionsOrder, FindOptionsWhere, ILike } from "typeorm";
import type Repository from "@/common/domain/repositories/Repository";
import type { RepositorySearchInput, RepositorySearchOutput } from "@/common/domain/repositories/repositorySearchIo";

type TEntityDefaultProps = {
    id: string,
    name: string,
    createdAt: Date,
    updatedAt: Date
};

export default abstract class TypeormRepository<TEntity extends TEntityDefaultProps>
    implements Repository<TEntity, DeepPartial<TEntity>> {
        protected abstract defaultSearchValues: RepositorySearchInput<TEntity>;
        protected abstract sortableFields: string[];

        constructor (
            protected readonly userRepository: BaseTypeormRepository<TEntity>
        ) {}

        public async findById(id: string): Promise<TEntity | null> {
            return await this._getById(id);
        }

        public create(data: DeepPartial<TEntity>): TEntity {
            return this.userRepository.create(data);
        }

        public async insert(model: TEntity): Promise<TEntity> {
            return await this.userRepository.save(model);
        }

        public async update(model: TEntity): Promise<TEntity> {
            const toUpdate: TEntity = await this._getById(model.id);

            if (!toUpdate) {
                return model;
            }

            return await this.userRepository.save({ ...toUpdate, ...model });
        }

        public async delete(id: string): Promise<TEntity | null> {
            const toDelete: TEntity = await this._getById(id);

            if (!toDelete) {
                return null;
            }

            await this.userRepository.delete(toDelete.id);
            return toDelete;
        }

        protected async _getById(id: string): Promise<TEntity | null> {
            const model: TEntity = await this.userRepository.findOneBy({ id } as FindOptionsWhere<TEntity>);

            if (!model) {
                return null;
            }

            return model;
        }

        public async search(config: RepositorySearchInput<TEntity>): Promise<RepositorySearchOutput<TEntity>> {
                const input = this.setDefaultValuesForInvalidSearchInputProps(config, this.defaultSearchValues);

                const searchResult: [TEntity[], number] = await this.searchForResults(input);

                return this.mapToSearchOutput(searchResult, input);
        }
        
        protected async searchForResults(searchInput: RepositorySearchInput<TEntity>): Promise<[TEntity[], number]> {
            return await this.userRepository.findAndCount({
            ...(searchInput.filter && { where: { name: ILike(`%${searchInput.filter}%`) } as FindOptionsWhere<TEntity> }),
            order: { [searchInput.sort]: searchInput.sortDir } as FindOptionsOrder<TEntity>,
            skip: (searchInput.page - 1) * searchInput.perPage,
            take: searchInput.perPage
            });
        }

        protected setDefaultValuesForInvalidSearchInputProps (
            originSearchInput: RepositorySearchInput<TEntity>,
            defaultSearchInput: RepositorySearchInput<TEntity>
        ): RepositorySearchInput<TEntity> {
            ["page", "perPage"].forEach((paginationNumber) => {
                if (this.isInvalidPaginationNumber(originSearchInput[paginationNumber])) {
                    originSearchInput[paginationNumber] = defaultSearchInput[paginationNumber]
                }
            })

            if (this.isInvalidSortField(originSearchInput.sort as string)) {
                originSearchInput.sort = defaultSearchInput.sort;
            }

            if (this.isInvalidSortDir(originSearchInput.sortDir)) {
                originSearchInput.sortDir = defaultSearchInput.sortDir;
            }

            if (this.isEmptyFilter(originSearchInput.filter)) {
                originSearchInput.filter = defaultSearchInput.filter;
            }
                
            return originSearchInput;
        }

        protected mapToSearchOutput (
            searchResult: [TEntity[], number],
            searchInput: RepositorySearchInput<TEntity>
        ): RepositorySearchOutput<TEntity> {
            return {
                items: searchResult[0],
                total: searchResult[1],
                currentPage: searchInput.page,
                perPage: searchInput.perPage,
                sort: searchInput.sort,
                sortDir: searchInput.sortDir,
                filter: searchInput.filter
            }
        }

        private isInvalidPaginationNumber(pageNumber?: number): boolean {
            return !pageNumber || pageNumber < 1|| !Number.isInteger(pageNumber);
        }

        private isInvalidSortField(sortField?: string): boolean {
            return !sortField || !this.sortableFields.includes(sortField)
        }

        private isInvalidSortDir(sortDir?: string): boolean {
            return !sortDir || !["asc", "desc"].includes(sortDir)
        }

        private isEmptyFilter(filter?: string) {
            return !filter;
       }
}