import InMemoryRepositoryProvider from "@/common/domain/repositories/InMemoryRepositoryProvider";
import type RepositorySearchResult from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchResult";
import type TestModel from "test/testingTools/testingTypes/TestModel";
import type RepositorySearchDSL from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchDSL";
import TestingMiscGenerator from "test/testingTools/testingFactories/TestingMiscGenerator";
import { MockRepositorySearcher } from "./InMemoryRepositoryProvider.mock";

describe ("InMemoryRepositoryProvider Test.", () => {
    let sut: InMemoryRepositoryProvider<TestModel>;

    let mockSearcher: MockRepositorySearcher<TestModel>;

    let model: TestModel;
    let result: TestModel;

    beforeEach(() => {
        mockSearcher = new MockRepositorySearcher();

        sut = new InMemoryRepositoryProvider(mockSearcher);

        model = TestingMiscGenerator.testingModel({});
    });

    describe ("create", () => {   
        it ("should create a new model.", async () => {
            model = { ...model, modelString: "test name" };
            result = await sut.create(model);
            expect (result.modelString).toStrictEqual("test name");
            expect (result).toEqual(sut["items"][0]);
        });
    });

    describe ("findById", () => {
        it ("should return null when data is not found by id.", async () => {
            result = await sut.findById("some_id");
            expect (result).toBeNull();
        });
    
        it ("should return data founded by id.", async () => {
            const createdData: TestModel = await sut.create(model);
            const foundData: TestModel = await sut.findById(createdData.id);

            expect(foundData).toEqual(sut["items"][0]);
        });
    });

    describe ("update", () => {
        it ("should return null when data to be updated is not found by id.", async () => {
            result = await sut.update(model);
            expect (result).toBeNull();
        });
    
        it ("should update data founded by id.", async () => {
            const createdData: TestModel = await sut.create(model);

            const updatedData: TestModel = await sut.update({
                ...createdData,
                modelString: "new test name",
                modelNumber: 12.00
            });

            expect(updatedData).toEqual(sut["items"][0]);
        });
    });
    
    describe ("delete", () => {
        it ("should return null when data to be deleted is not found by id.", async () => {
            result = await sut.delete(model.id);
            expect (result).toBeNull();
        });
    
        it ("should delete data founded by id.", async () => {
            const createdData: TestModel = await sut.create(model);

            const countBeforeDelete: number = sut["items"].length;

            await sut.delete(createdData.id);

            const countAfterDelete: number = sut["items"].length

            expect([countBeforeDelete, countAfterDelete]).toEqual([1, 0]);
        });
    });


    describe ("search", () => {
        it ("should use composition method 'search' to apply search query and return a search result.", async () => {
            const dsl: RepositorySearchDSL<TestModel> = {
                pagination: {
                    pageNumber: 1,
                    itemsPerPage: 15
                },
                sorting: {
                    field: "createdAt",
                    direction: "desc"
                },
                filter: {
                    field: "modelString",
                    value: ""
                }       
            };
            
            const searcherOutput: RepositorySearchResult<TestModel> = {
                items: Array.from({ length: 15 }),
                total: 50,
                pagination: {
                    currentPage: dsl.pagination.pageNumber,
                    itemsPerPage: dsl.pagination.itemsPerPage
                },
                sorting: {
                    field: dsl.sorting.field,
                    direction: dsl.sorting.direction
                },
                filter: {
                    field: dsl.filter.field,
                    value: dsl.filter.value
                }
            }
            
            mockSearcher.search.mockResolvedValue(searcherOutput);

            const result: RepositorySearchResult<TestModel> = await sut.search(dsl);

            expect (result).toEqual(searcherOutput);

            expect (mockSearcher.search).toHaveBeenCalledExactlyOnceWith(sut["items"], dsl);
        });
    });
});