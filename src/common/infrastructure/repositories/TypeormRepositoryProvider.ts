import { injectable } from "tsyringe";
import type RepositoryProvider from "@/common/domain/repositories/RepositoryProvider";
import type { Repository as BaseTypeormRepository, DeepPartial, FindOptionsWhere } from "typeorm";
import type RepositorySearcher from "@/common/domain/search/repositorySearcher/RepositorySearcher";
import type RepositorySearchDSL from "@/common/domain/search/repositorySearcher/RepositorySearchDSL";
import type RepositorySearchResult from "@/common/domain/search/repositorySearcher/RepositorySearchResult";
import type RepositorySearchinput from "@/common/domain/search/repositorySearcher/RepositorySearchInput";

type TModelDefaultProps = {
    id: string,
    createdAt: Date,
    updatedAt: Date
};

@injectable()
export default class TypeormRepositoryProvider<TModel extends TModelDefaultProps> implements RepositoryProvider<TModel, DeepPartial<TModel>> {
        constructor (
            private readonly baseTypeormRepository: BaseTypeormRepository<TModel>,
            private readonly searcher: RepositorySearcher<TModel>
        ) {}

        public async findById(id: string): Promise<TModel | null> {
            return await this._getById(id);
        }

        public async findOneBy(field: keyof TModel, value: unknown): Promise<TModel> {
            return await this.baseTypeormRepository.findOne({ [field]: value })
        }

        public async findManyBy(field: keyof TModel, value: unknown): Promise<TModel[]> {
            return await this.baseTypeormRepository.find({ [field]: value })
        }

        public async create(data: DeepPartial<TModel>): Promise<TModel> {
            const model: TModel = this.baseTypeormRepository.create(data);
            return await this.baseTypeormRepository.save(model);
        }

        public async update(model: TModel): Promise<TModel> {
            const toUpdate: TModel = await this._getById(model.id);

            if (!toUpdate) {
                return model;
            }

            return await this.baseTypeormRepository.save({ ...toUpdate, ...model });
        }

        public async delete(id: string): Promise<TModel | null> {
            const toDelete: TModel = await this._getById(id);

            if (!toDelete) {
                return null;
            }

            await this.baseTypeormRepository.delete(toDelete.id);
            return toDelete;
        }

        public async search(dslQuery: RepositorySearchDSL<TModel>): Promise<RepositorySearchResult<TModel>> {
            return await this.searcher.search(this.baseTypeormRepository, dslQuery);
        }

        private async _getById(id: string): Promise<TModel | null> {
            const model: TModel = await this.baseTypeormRepository.findOneBy({ id } as FindOptionsWhere<TModel>);

            if (!model) {
                return null;
            }

            return model;
        }
}