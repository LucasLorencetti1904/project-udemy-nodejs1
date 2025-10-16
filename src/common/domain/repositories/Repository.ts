export type SearchInput = {
    page?: number,
    perPage?: number,
    sort?: string | null,
    sortDir?: "asc" | "desc" | null,
    filter?: string | null
};

export type SearchOutput<Model> = Required<SearchInput> & {
    items: Model[],
    total: number,
};

export default interface Repository<Model, CreateData> {
    create(data: CreateData): Model;
    insert(model: Model): Promise<Model>;
    findById(id: string): Promise<Model>;
    update(model: Model): Promise<Model>;
    delete(id: string): Promise<void>;
    search(config: SearchInput): Promise<SearchOutput<Model>>;
}