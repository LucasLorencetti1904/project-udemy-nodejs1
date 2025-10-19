export type SearchInput = {
    page?: number,
    perPage?: number,
    sort?: string,
    sortDir?: "asc" | "desc",
    filter?: string
};

export type SearchOutput<Model> = {
    items: Model[],
    total: number,
    currentPage: number,
    perPage: number,
    sort: string,
    sortDir: "asc" | "desc",
    filter: string
};

export default interface Repository<Model, CreateData> {
    create(data: CreateData): Model;
    insert(model: Model): Promise<Model>;
    findById(id: string): Promise<Model>;
    update(model: Model): Promise<Model>;
    delete(id: string): Promise<void>;
    search(config: SearchInput): Promise<SearchOutput<Model>>;
}