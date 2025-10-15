import InMemoryRepository from "@/common/domain/repositories/InMemoryRepository";

export type StubModelProps = {
    id: string,
    name: string,
    price: number,
    createdAt: Date,
    updatedAt: Date 
};

export class StubInMemoryRepository extends InMemoryRepository<StubModelProps> {
    constructor() {
        super();
        this.sortableFields = ["name"];
    }
    protected async applyFilter(items: StubModelProps[], filter?: string): Promise<StubModelProps[]> {
        if (!filter) {
            return items;
        }

        return items.filter((item: StubModelProps): void => {
            item.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
        });
    }
};  