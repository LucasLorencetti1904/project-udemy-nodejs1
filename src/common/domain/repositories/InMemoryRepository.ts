import Repository, { SearchInput, SearchOutput } from "@/common/domain/repositories/Repository";
import { NotFoundError } from "@/common/domain/errors/httpErrors";
import { randomUUID } from "node:crypto";

type ModelProps = {
    id: string,
    [key: string]: any
};

type CreateDataProps = {
    [key: string]: any;
};

export default abstract class InMemoryRepository<Model extends ModelProps>
    implements Repository<Model, CreateDataProps> {
        public items: Model[] = [];
        public sortableFields: string[] = [];

        public async findById(id: string): Promise<Model> {
            return this._get(id);
        }

        public create(data: CreateDataProps): Model {
            return {
                id: randomUUID,
                created_at: new Date(),
                updated_at: new Date(),
                ...data
            } as unknown as Model;
        }

        public async insert(model: Model): Promise<Model> {
            this.items.push(model);
            return model;
        }

        public async update(model: Model): Promise<Model> {
            const index: number = await this.checkAndReturnIndexOf(model.id);
            let toUpdate = this.items[index];
            toUpdate = model;
            return toUpdate;
        }

        public async delete(id: string): Promise<void> {
            const index: number = await this.checkAndReturnIndexOf(id);
            this.items.splice(index, 1);
        }

        public async search(config: SearchInput): Promise<SearchOutput<Model>> {
            const page: number = config.page ?? 1;
            const perPage: number = config.page ?? 15;
            const sort: string | null = config.sort ?? null;
            const sortDir: string | null = config.sort ?? null;
            const filter: string | null = config.filter ?? null;

            const filteredItems: Model[] = await this.applyFilter(this.items, filter);
            const orderedItems: Model[] = await this.applySort(filteredItems, sort, sortDir);
            const paginatedItems: Model[] = await this.applyPaginate(orderedItems, page, perPage);

            return {
                items: paginatedItems,
                filter,
                total: filteredItems.length,
                page,
                perPage,
                sort,
                sortDir
            };
        }

        protected abstract applyFilter(items: Model[], filter?: string): Promise<Model[]>

        protected async applySort(items: Model[], sort?: string, sortDir?: string): Promise<Model[]> {
            if (!sort || !this.sortableFields.includes(sort)) {
                return items;
            }

            return [...items].sort((a: Model, b: Model): number => {
                if (a[sort] < b[sort]) {
                    return sortDir === "asc" ? -1 : 1;
                }

                if (a[sort] > b[sort]) {
                    return sortDir === "asc" ? 1 : -1;
                }
            });
        }

        protected async applyPaginate(items: Model[], page: number, perPage: number): Promise<Model[]> {
            const start: number = (page - 1) * perPage;
            const end: number = start + perPage;
            return items.slice(start, end);
        }

        protected async _get(id: string): Promise<Model> {
            const result: Model | undefined = this.items.find(item => item.id === id);

            if (!result) {
                throw new NotFoundError(`Model not found using ID ${id}`);
            }

            return result;
        }

        protected async checkAndReturnIndexOf(id: string): Promise<number> {
            await this._get(id);

            return this.items.findIndex(item => item.id === id);
        }
};