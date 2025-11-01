import { randomUUID } from "node:crypto";
import { StubInMemoryRepository, StubModelProps } from "./InMemoryRepository.stub";
import type { RepostitorySearchOutput } from "@/common/domain/repositories/Repository";

describe ("InMemoryRepository Test.", () => {
    let sut: StubInMemoryRepository;
    let model: StubModelProps;
    let result: StubModelProps;
    let props: any;

    beforeEach(() => {
        sut = new StubInMemoryRepository();
        props = {
            name: "test name",
            price: 10.00
        };

        const date: Date = new Date();

        model = {
            id: randomUUID(),
            ...props,
            createdAt: date,
            updatedAt: date
        };
    });

    describe ("create", () => {
        it ("should create a new model.", () => {
            result = sut.create(props);
            expect (result.name).toStrictEqual("test name")
        });
    
        it ("should insert the model.", async () => {
            result = await sut.insert(model);
            expect (result).toEqual(sut.items[0])
        });
    })

    describe ("findById", () => {
        it ("should return null when data is not found by id.", async () => {
            result = await sut.findById("some_id");
            expect (result).toBeNull();
        });
    
        it ("should return data founded by id.", async () => {
            const createdData: StubModelProps = await sut.insert(model);
            const foundData: StubModelProps = await sut.findById(createdData.id);
            expect(foundData).toEqual(sut.items[0]);
        });
    });

    describe ("update", () => {
        it ("should return null when data to be updated is not found by id.", async () => {
            result = await sut.update(model)
            expect (result).toBeNull();
        });
    
        it ("should update data founded by id.", async () => {
            const createdData: StubModelProps = await sut.insert(model);
            const updatedData: StubModelProps = await sut.update({
                ...createdData,
                name: "new test name",
                price: 12.00
            });
            expect(updatedData).toEqual(sut.items[0]);
        });
    });
    
    describe ("delete", () => {
        it ("should return null when data to be deleted is not found by id.", async () => {
            result = await sut.delete(model.id);
            expect (result).toBeNull();
        });
    
        it ("should delete data founded by id.", async () => {
            const createdData: StubModelProps = await sut.insert(model);
            const countBeforeDelete: number = sut.items.length;
            await sut.delete(createdData.id);
            const countAfterDelete: number = sut.items.length
            expect([countBeforeDelete, countAfterDelete]).toEqual([1, 0]);
        });
    });

    describe ("applyFilter", () => {
        const models: StubModelProps[] = [
            { ...model, name: "test name" },
            { ...model, name: "TEST NAME" },
            { ...model, name: "fake name"}
        ];

        let filteredModels: StubModelProps[];

        it ("should no filter items when filter param is null.", async () => {
            filteredModels = await sut['applyFilter'](models);
            expect (filteredModels).toEqual(models);
        });

        it ("should filter items using filter param.", async () => {
            filteredModels = await sut['applyFilter'](models, "TES");
            expect (filteredModels).toEqual([models[0], models[1]]);
        });

        it ("should return a empty array when filter does not matches.", async () => {
            filteredModels = await sut['applyFilter'](models, "truthy name");
            expect (filteredModels).toHaveLength(0);
        });
    });

    describe ("applySort", () => {
        const models: StubModelProps[] = [
            { ...model, name: "c" },
            { ...model, name: "a" },
            { ...model, name: "b"}
        ];

        let sortedModels: StubModelProps[];

        it ("should no sort items when sort and sortDir params is null.", async () => {
            sortedModels = await sut['applySort'](models);
            expect (sortedModels).toEqual(models);
        });

        it ("should no sort items when sort param is not sortable field.", async () => {
            sortedModels = await sut['applySort'](models, "id", "asc");
            expect (sortedModels).toEqual(models);
        });

        it ("should sort items by sortable fields using asc order.", async () => {
            sortedModels = await sut['applySort'](models, "name", "asc");
            expect (sortedModels).toEqual([models[1], models[2], models[0]]);
        });

        it ("should sort items by sortable fields using desc order.", async () => {
            sortedModels = await sut['applySort'](models, "name", "desc");
            expect (sortedModels).toEqual([models[0], models[2], models[1]]);
        });
    });

    describe ("applyPaginate", () => {
        const models: StubModelProps[] = [
            { ...model, name: "a" },
            { ...model, name: "b" },
            { ...model, name: "c"},
            { ...model, name: "d"},
            { ...model, name: "e"},
            { ...model, name: "f"}
        ];

        let paginatedItemsModels: StubModelProps[];

        it ("should paginate the page 1 with 2 items.", async () => {
            paginatedItemsModels = await sut['applyPaginate'](models, 1, 2);
            expect (paginatedItemsModels).toEqual([models[0], models[1]]);
        });

        it ("should return page 2 with 2 items.", async () => {
            paginatedItemsModels = await sut['applyPaginate'](models, 2, 2);
            expect (paginatedItemsModels).toEqual([models[2], models[3]]);
        });

        it ("should return page 2 with 3 items.", async () => {
            paginatedItemsModels = await sut['applyPaginate'](models, 2, 3);
            expect (paginatedItemsModels).toEqual([models[3], models[4], models[5]]);
        });

        it ("should return a partial page when there are no more items left.", async () => {
            paginatedItemsModels = await sut['applyPaginate'](models, 2, 4);
            expect (paginatedItemsModels).toEqual([models[4], models[5]]);
        });

        it ("should paginate an empty array when all items have been paginated.", async () => {
            paginatedItemsModels = await sut['applyPaginate'](models, 3, 3);
            expect (paginatedItemsModels).toEqual([]);
        });
    });

    describe ("applySort", () => {
        const models: StubModelProps[] = [
            { ...model, name: "c" },
            { ...model, name: "a" },
            { ...model, name: "b"}
        ];

        let sortedModels: StubModelProps[];

        it ("should no sort items when sort and sortDir params is null.", async () => {
            sortedModels = await sut['applySort'](models);
            expect (sortedModels).toEqual(models);
        });

        it ("should no sort items when sort param is not sortable field.", async () => {
            sortedModels = await sut['applySort'](models, "id", "asc");
            expect (sortedModels).toEqual(models);
        });

        it ("should sort items by sortable fields using asc order.", async () => {
            sortedModels = await sut['applySort'](models, "name", "asc");
            expect (sortedModels).toEqual([models[1], models[2], models[0]]);
        });

        it ("should sort items by sortable fields using desc order.", async () => {
            sortedModels = await sut['applySort'](models, "name", "desc");
            expect (sortedModels).toEqual([models[0], models[2], models[1]]);
        });
    });

    describe ("search", () => {
        let result: RepostitorySearchOutput<StubModelProps>;

        beforeEach(() => {
            sut.items = Array(16).fill(model);
        });

        it ("should return a default pagination with the first unsorted items when params is not specified.", async () => {
            result = await sut['search']({});
            expect (result).toEqual<RepostitorySearchOutput<StubModelProps>>({
                items: sut.items.slice(0, 15),
                total: sut.items.length,
                currentPage: 1,
                perPage: 15,
                sort: null,
                sortDir: null,
                filter: null
            });
        });

        it ("should return pagination with unsorted items when params when only paginate params is received.", async () => {
            result = await sut['search']({
                page: 4,
                perPage: 4
            });
            expect (result).toEqual<RepostitorySearchOutput<StubModelProps>>({
                items: sut.items.slice(0, 4),
                total: sut.items.length,
                currentPage: 4,
                perPage: 4,
                sort: null,
                sortDir: null,
                filter: null
            });
        });

        it ("should return pagination with filtered items when only paginate and filter params is received.", async () => {
            sut.items = [
                { ...model, name: "Test 1" },
                { ...model, name: "b" },
                { ...model, name: "TEST 2" },
                { ...model, name: "test 3" }
            ];
            result = await sut['search']({
                page: 2,
                perPage: 2,
                filter: "tE"
            });
            expect (result).toEqual<RepostitorySearchOutput<StubModelProps>>({
                items: [sut.items[3]],
                total: 3,
                currentPage: 2,
                perPage: 2,
                sort: null,
                sortDir: null,
                filter: "tE"
            });
        });

        it ("should return pagination with sorted items when only paginate and sort params is received.", async () => {
            sut.items = [
                { ...model, name: "c" },
                { ...model, name: "a" },
                { ...model, name: "d" },
                { ...model, name: "b" }
            ];
            result = await sut['search']({
                page: 2,
                perPage: 2,
                sort: "name",
                sortDir: "asc"
            });
            expect (result).toEqual<RepostitorySearchOutput<StubModelProps>>({
                items: [sut.items[0], sut.items[2]],
                total: 4,
                currentPage: 2,
                perPage: 2,
                sort: "name",
                sortDir: "asc",
                filter: null
            });
        });
    
        it ("should return a pagination with filtered and sorted items when all params is received.", async () => {
            sut.items = [
                { ...model, name: "a2" },
                { ...model, name: "b1" },
                { ...model, name: "B2" },
                { ...model, name: "A1" }
            ];
            result = await sut['search']({
                page: 1,
                perPage: 2,
                sort: "name",
                sortDir: "desc",
                filter: "2"
            });
            expect (result).toEqual<RepostitorySearchOutput<StubModelProps>>({
                items: [sut.items[0], sut.items[2]],
                total: 2,
                currentPage: 1,
                perPage: 2,
                sort: "name",
                sortDir: "desc",
                filter: "2"
            });
        });
    });
});  