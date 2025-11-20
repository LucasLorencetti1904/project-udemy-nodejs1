import type SearchProductUseCase from "@/products/application/usecases/searchProduct/SeachProductUseCase";
import SearchProductUseCaseImpl from "@/products/application/usecases/searchProduct/SeachProductUseCaseImpl";
import MockProductRepository from "./ProductUseCase.mock";
import type ProductModel from "@/products/domain/models/ProductModel";
import type { SearchProductInput, SearchProductOutput } from "@/products/application/dto/searchProductIo";
import type RepositorySearchResult from "@/common/domain/search/repositorySearcher/RepositorySearchResult";
import TestingProductFactory from "test/testingTools/testingFactories/TestingProductFactory";
import { InternalError } from "@/common/domain/errors/httpErrors";

const defaultRepoOutput: RepositorySearchResult<ProductModel> = {
    items: Array.from({ length: 15 }, () => TestingProductFactory.model({})),
    total: 50,
    pagination: {
        currentPage: 1,
        itemsPerPage: 15,
    },
    sorting: {
        field: "createdAt",
        direction: "desc",
    },
    filter: {
        field: "name",
        value: ""
    }
};

const defaultUseCaseOutput: SearchProductOutput = {
    items: defaultRepoOutput.items,
    total: 50,
    pagination: {
        currentPage: 1,
        itemsPerPage: 15,
        lastPage: 4
    }
};

describe ("SearchProductUseCase Test", () => {  
    let sut: SearchProductUseCase;
    let mockRepository: MockProductRepository;

    let result: SearchProductOutput;

    beforeEach (() => {
        mockRepository = new MockProductRepository();
        sut = new SearchProductUseCaseImpl(mockRepository);        
    });

    type Case = {
        description: string,
        input: SearchProductInput,
        output: RepositorySearchResult<ProductModel>,
        expected: SearchProductOutput
    };

    const specificCases: Case[] = [
        {
            description: "should return default search result when input is empty",
            input: {},
            output: { ...defaultRepoOutput },
            expected: { ...defaultUseCaseOutput }
        },
        {
            description: "should return default search result when input is invalid",
            input: {
                pagination: {
                    pageNumber: -23,
                    itemsPerPage: 2.7
                },
                sorting: {
                    field: "quantity",
                    direction: "desc"
                },
                filter: {
                    field: "id",
                    value: ""
                }
            },
            output: { ...defaultRepoOutput },
            expected: { ...defaultUseCaseOutput }
        },
        {
            description: "should calculate the last page and return specific search result when input is valid",
            input: {
                pagination: {
                    pageNumber: 3,
                    itemsPerPage: 9
                },
                sorting: {
                    field: "name",
                    direction: "asc"
                },
                filter: {
                    field: "name",
                    value: "exmpl"
                }
            },
            output: {
                total: 50,
                items: [ ...defaultRepoOutput.items.slice(18, 27) ],
                pagination: {
                    currentPage: 3,
                    itemsPerPage: 9
                },
                sorting: {
                    field: "name",
                    direction: "asc"
                },
                filter: {
                    field: "name",
                    value: "exmpl"
                }
            },
            expected: {
                total: 50,
                items: [ ...defaultRepoOutput.items.slice(18, 27) ],
                pagination: {
                    currentPage: 3,
                    itemsPerPage: 9,
                    lastPage: 6
                }
            }
        }
    ];

    specificCases.forEach(({ description, input, output, expected }) => {
        it (description, async () => {        
            mockRepository.search.mockResolvedValue(output);

            result = await sut.execute(input);
            
            expect (result).toEqual(expect.objectContaining(expected));
            expect (mockRepository.search).toHaveBeenCalledExactlyOnceWith(input);
        });
    });

    it ("should throw an InternalError repository throws an unexpected error.", async () => {
        await expect (sut.execute({})).rejects.toBeInstanceOf(InternalError);
        expect (mockRepository.search).toHaveBeenCalledExactlyOnceWith({});
    });
});