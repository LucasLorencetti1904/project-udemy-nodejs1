export type RepositorySearchInput<TModel> = {
    page?: number,
    perPage?: number,
    sort?: keyof TModel,
    sortDir?: "asc" | "desc",
    filter?: string
};

export type RepositorySearchOutput<TModel> = {
    items: TModel[],
    total: number,
    currentPage: number,
    perPage: number,
    sort: keyof TModel,
    sortDir: "asc" | "desc",
    filter: string
};

export default interface Repository<TModel, CreateData> {
    create(data: CreateData): TModel;
    insert(model: TModel): Promise<TModel>;
    findById(id: string): Promise<TModel | null>;
    update(model: TModel): Promise<TModel>;
    delete(id: string): Promise<TModel | null>;
    search(config: RepositorySearchInput<TModel>): Promise<RepositorySearchOutput<TModel>>;
}