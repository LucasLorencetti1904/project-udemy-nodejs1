import { injectable } from "tsyringe";
import type RepositoryProvider from "@/common/domain/repositories/RepositoryProvider";
import type RepositorySearchinput from "@/common/domain/search/repositorySearcher/RepositorySearchInput";
import type RepositorySearchResult from "@/common/domain/search/repositorySearcher/RepositorySearchResult";
import type SearchQueryFormatter from "@/common/domain/search/searchQueryFormatter/SearchQueryFormatter";
import type RepositorySearcher from "@/common/domain/search/repositorySearcher/RepositorySearcher";
import type RepositorySearchDSL from "@/common/domain/search/repositorySearcher/RepositorySearchDSL";
import { randomUUID } from "node:crypto";

type ModelProps = {
    id: string,
    [key: string]: any
};

type CreateDataProps = {
    [key: string]: any;
};

@injectable()
export default class InMemoryRepository<TModel extends ModelProps> implements RepositoryProvider<TModel, CreateDataProps> {
    private items: TModel[] = [];

    constructor(
        private readonly searchQueryFormatter: SearchQueryFormatter<TModel>,
        private readonly searcher: RepositorySearcher<TModel>
    ) {}

    public async findById(id: string): Promise<TModel | null> {
        return this._get(id);
    }

    public async findManyBy(field: keyof TModel, value: unknown): Promise<TModel[]> {
        return this.items.filter((item) => item[field] === value);
    }

    public async findOneBy(field: keyof TModel, value: unknown): Promise<TModel | null> {
        return this.items.find((item) => item[field] === value);
    }    

    public async findManyWhere(callback: (item: TModel) => boolean): Promise<TModel[]> {
        return this.items.filter(callback);
    }

    public async create(data: CreateDataProps): Promise<TModel> {
        const model: TModel = {
            id: randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data
        } as unknown as TModel;

        this.items.push(model);

        return model;
    }

    public async update(model: TModel): Promise<TModel | null> {
        const index: number = await this.checkAndReturnIndexOf(model.id);

        if (index < 0) {
            return null;
        }

        this.items[index] = model;
        return this.items[index];
    }

    public async delete(id: string): Promise<TModel | null> {
        const index: number = await this.checkAndReturnIndexOf(id);

        if (index < 0) {
            return null;
        }

        const deleted: TModel = this.items[index];
        this.items.splice(index, 1);
        return deleted;
    }

    public async search(query: RepositorySearchinput<TModel>): Promise<RepositorySearchResult<TModel>> {
        const dsl: RepositorySearchDSL<TModel> = this.searchQueryFormatter.formatInput(query);
        return await this.searcher.search(this.items, dsl);
    }

    protected async _get(id: string): Promise<TModel | null> {
        const result: TModel | undefined = this.items.find(item => item.id === id);

        if (!result) {
            return null;
        }

        return result;
    }

    protected async checkAndReturnIndexOf(id: string): Promise<number> {
        await this._get(id);

        return this.items.findIndex(item => item.id === id);
    }
};