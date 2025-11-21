import InMemoryRepositoryRepositorySearcher from "@/common/domain/repositories/search/repositorySearcher/InMemoryRepositorySearcher";
import type TestModel from "test/testingTools/testingTypes/TestModel";
import type RepositorySearchDSL from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchDSL";
import type RepositorySearchResult from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchResult";
import TestingMiscGenerator from "test/testingTools/testingFactories/TestingMiscGenerator";

let sut: InMemoryRepositoryRepositorySearcher<TestModel>;

let model: TestModel;

describe ("InMemoryRepositorySearcher", () => {
    beforeEach (() => {
        sut = new InMemoryRepositoryRepositorySearcher();

        model = TestingMiscGenerator.testingModel({});
    });

    describe ("applyFilter", () => {
        const models: TestModel[] = [
            { ...model, modelString: "test name" },
            { ...model, modelString: "TEST NAME" },
            { ...model, modelString: "fake name"}
        ];

        let filteredModels: TestModel[];

        it ("should filter items using filter param.", async () => {
            filteredModels = await sut['applyFilter'](models, { field: "modelString", value: "TES" });
            expect (filteredModels).toEqual([models[0], models[1]]);
        });

        it ("should return a empty array when filter does not matches.", async () => {
            filteredModels = await sut['applyFilter'](models, { field: "modelString", value: "truthy modelString" });
            expect (filteredModels).toHaveLength(0);
        });
    });

    describe ("applySort", () => {
        const models: TestModel[] = [
            { ...model, modelString: "c" },
            { ...model, modelString: "a" },
            { ...model, modelString: "b"}
        ];

        let sortedModels: TestModel[];

        it ("should no sort items when sort param is not sortable field.", async () => {
            sortedModels = await sut['applySort'](models, { field: "id", direction: "asc" } );
            expect (sortedModels).toEqual(models);
        });

        it ("should sort items by sortable fields using asc order.", async () => {
            sortedModels = await sut['applySort'](models, { field: "modelString", direction: "asc" });
            expect (sortedModels).toEqual([models[1], models[2], models[0]]);
        });

        it ("should sort items by sortable fields using desc order.", async () => {
            sortedModels = await sut['applySort'](models, { field: "modelString", direction: "desc" });
            expect (sortedModels).toEqual([models[0], models[2], models[1]]);
        });
    });

    describe ("applyPaginate", () => {
        const models: TestModel[] = [
            { ...model, modelString: "a" },
            { ...model, modelString: "b" },
            { ...model, modelString: "c"},
            { ...model, modelString: "d"},
            { ...model, modelString: "e"},
            { ...model, modelString: "f"}
        ];

        let paginatedItemsModels: TestModel[];

        it ("should paginate the page 1 with 2 items.", async () => {
            paginatedItemsModels = await sut['applyPaginate'](models, { pageNumber: 1, itemsPerPage: 2 });
            expect (paginatedItemsModels).toEqual([models[0], models[1]]);
        });

        it ("should return page 2 with 2 items.", async () => {
            paginatedItemsModels = await sut['applyPaginate'](models, { pageNumber: 2, itemsPerPage: 2 });
            expect (paginatedItemsModels).toEqual([models[2], models[3]]);
        });

        it ("should return page 2 with 3 items.", async () => {
            paginatedItemsModels = await sut['applyPaginate'](models, { pageNumber: 2, itemsPerPage: 3 });
            expect (paginatedItemsModels).toEqual([models[3], models[4], models[5]]);
        });

        it ("should return a partial page when there are no more items left.", async () => {
            paginatedItemsModels = await sut['applyPaginate'](models, { pageNumber: 2, itemsPerPage: 4 });
            expect (paginatedItemsModels).toEqual([models[4], models[5]]);
        });

        it ("should paginate an empty array when all items have been paginated.", async () => {
            paginatedItemsModels = await sut['applyPaginate'](models, { pageNumber: 3, itemsPerPage: 3 });
            expect (paginatedItemsModels).toEqual([]);
        });
    });

    describe ("search", () => {
        const models: TestModel[] = [
            { ...model, modelString: "test" },
            { ...model, modelString: "example" },
            { ...model, modelString: "EXMP" },
            { ...model, modelString: "eXaMple" },
            { ...model, modelString: "EXAMPLE" },
        ];

        const searchInput: RepositorySearchDSL<TestModel> = {
            pagination: {
                pageNumber: 2,
                itemsPerPage: 2
            },
            sorting: {
                field: "modelString",
                direction: "asc"
            },
            filter: {
                field: "modelString",
                value: "ple"
            }
        };

        const expected: RepositorySearchResult<TestModel> = {
            total: 3,
            items: [models[1]],
            pagination: {
                currentPage: 2,
                itemsPerPage: 2
            },
            sorting: {
                field: "modelString",
                direction: "asc"
            },
            filter: {
                field: "modelString",
                value: "ple"
            }
        };

        let searchResult: RepositorySearchResult<TestModel>;

        it ("should apply all search params and return a search result.", async () => {
            searchResult = await sut.search(models, searchInput);
            expect (searchResult).toEqual(expected);
        });
    });
});