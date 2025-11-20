import { injectable } from "tsyringe";
import type RepositorySearcher from "@/common/domain/search/repositorySearcher/RepositorySearcher";
import type RepositorySearchResult from "@/common/domain/search/repositorySearcher/RepositorySearchResult";
import type RepositorySearchDSL from "@/common/domain/search/repositorySearcher/RepositorySearchDSL";
import { FindOptionsOrder, FindOptionsWhere, ILike, Repository } from "typeorm";

@injectable()
export default class TypeormRepositorySearcher<TModel> implements RepositorySearcher<TModel> {
        public async search(typeormRepo: Repository<TModel>, dsl: RepositorySearchDSL<TModel>): Promise<RepositorySearchResult<TModel>> {
                const searchResult: [TModel[], number] = await this.searchForResults(dsl, typeormRepo);

                return this.mapToSearchResult(searchResult, dsl);
        }
        
        private async searchForResults(dsl: RepositorySearchDSL<TModel>, typeormRepo: Repository<TModel>): Promise<[TModel[], number]> {
            return await typeormRepo.findAndCount({
                where: { [dsl.filter.field]: ILike(`%${dsl.filter.value}%`) } as FindOptionsWhere<TModel>,
                order: { [dsl.sorting.field]: dsl.sorting.direction } as FindOptionsOrder<TModel>,
                skip: (dsl.pagination.pageNumber - 1) * dsl.pagination.itemsPerPage,
                take: dsl.pagination.itemsPerPage
            });
        }

        private mapToSearchResult (
            searchResult: [TModel[], number],
            searchDsl: RepositorySearchDSL<TModel>
        ): RepositorySearchResult<TModel> {
            return {
                items: searchResult[0],
                total: searchResult[1],
                pagination: {
                    currentPage: searchDsl.pagination.pageNumber,
                    itemsPerPage: searchDsl.pagination.itemsPerPage,
                },
                sorting: {
                    field: searchDsl.sorting.field,
                    direction: searchDsl.sorting.direction,
                },
                filter: {
                    field: searchDsl.filter.field,
                    value: searchDsl.filter.value
                }
            };
        }
}