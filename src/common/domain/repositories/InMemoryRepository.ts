import { randomUUID } from "node:crypto";
import type Repository from "@/common/domain/repositories/Repository"
import type { RepositorySearchInput, RepositorySearchOutput } from "@/common/domain/repositories/repositoryIo";

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

        public async findById(id: string): Promise<Model | null> {
            return this._get(id);
        }

        public create(data: CreateDataProps): Model {
            return {
                id: randomUUID(),
                createdAt: new Date(),
                updatedAt: new Date(),
                ...data
            } as unknown as Model;
        }

        public async insert(model: Model): Promise<Model> {
            this.items.push(model);
            return model;
        }

        public async update(model: Model): Promise<Model | null> {
            const index: number = await this.checkAndReturnIndexOf(model.id);

            if (index < 0) {
                return null;
            }

            this.items[index] = model;
            return this.items[index];
        }

        public async delete(id: string): Promise<Model | null> {
            const index: number = await this.checkAndReturnIndexOf(id);

            if (index < 0) {
                return null;
            }

            const deleted: Model = this.items[index];
            this.items.splice(index, 1);
            return deleted;
        }

        public async search(config: RepositorySearchInput<Model>): Promise<RepositorySearchOutput<Model>> {
            const page: number = config.page ?? 1;
            const perPage: number = config.perPage ?? 15;
            const sort: keyof Model | null = config.sort ?? null;
            const sortDir: "asc" | "desc" | null = config.sortDir ?? null;
            const filter: string | null = config.filter ?? null;

            const filteredItems: Model[] = await this.applyFilter(this.items, filter);
            const orderedItems: Model[] = await this.applySort(filteredItems, sort, sortDir);
            const paginatedItems: Model[] = await this.applyPaginate(orderedItems, page, perPage);

            return {
                items: paginatedItems,
                filter,
                total: filteredItems.length,
                currentPage: page,
                perPage,
                sort,
                sortDir
            };
        }

        protected abstract applyFilter(items: Model[], filter?: string): Promise<Model[]>

        protected async applySort(items: Model[], sort?: keyof Model, sortDir?: "asc" | "desc"): Promise<Model[]> {
            if (!sort || !this.sortableFields.includes(sort as string)) {
                return items;
            }

            return [...items].sort((a, b) => {
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

        protected async _get(id: string): Promise<Model | null> {
            const result: Model | undefined = this.items.find(item => item.id === id);

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