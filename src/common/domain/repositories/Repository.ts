import type RepositorySearchResult from "@/common/domain/search/repositorySearcher/RepositorySearchResult";
import type RepositorySearchDSL from "@/common/domain/search/repositorySearcher/RepositorySearchDSL";

export default interface Repository<TModel, CreateData> {
    create(data: CreateData): Promise<TModel>;
    findById(id: string): Promise<TModel | null>;
    update(model: TModel): Promise<TModel>;
    delete(id: string): Promise<TModel | null>;
    search(dslQuery: RepositorySearchDSL<TModel>): Promise<RepositorySearchResult<TModel>>;
}