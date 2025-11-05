import type { RepositorySearchInput, RepositorySearchOutput } from "@/common/domain/repositories/repositorySearchIo";

export default interface Repository<TModel, CreateData> {
    create(data: CreateData): TModel;
    insert(model: TModel): Promise<TModel>;
    findById(id: string): Promise<TModel | null>;
    update(model: TModel): Promise<TModel>;
    delete(id: string): Promise<TModel | null>;
    search(config: RepositorySearchInput<TModel>): Promise<RepositorySearchOutput<TModel>>;
}