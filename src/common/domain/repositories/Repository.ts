import type RepositorySearchinput from "@/common/domain/search/repositorySearcher/RepositorySearchInput";
import type RepositorySearchResult from "@/common/domain/search/repositorySearcher/RepositorySearchResult";

export default interface Repository<TModel, CreateData> {
    create(data: CreateData): Promise<TModel>;
    findById(id: string): Promise<TModel | null>;
    update(model: TModel): Promise<TModel>;
    delete(id: string): Promise<TModel | null>;
    search(query: RepositorySearchinput<TModel>): Promise<RepositorySearchResult<TModel>>;
}