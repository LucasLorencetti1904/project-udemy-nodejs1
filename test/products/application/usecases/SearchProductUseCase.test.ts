import type SearchProductUseCase from "@/products/application/usecases/searchProduct/SeachProductUseCase";
import SearchProductUseCaseImpl from "@/products/application/usecases/searchProduct/SeachProductUseCaseImpl";
import { MockProductRepository, MockSearchQueryFormatter } from "./ProductUseCase.mock";
import type ProductModel from "@/products/domain/models/ProductModel";
import type { SearchProductInput, SearchProductOutput } from "@/products/application/dto/searchProductIo";
import type RepositorySearchResult from "@/common/domain/search/repositorySearcher/RepositorySearchResult";
import TestingProductFactory from "test/testingTools/testingFactories/TestingProductFactory";
import { InternalError } from "@/common/domain/errors/httpErrors";
import RepositorySearchDSL from "@/common/domain/search/repositorySearcher/RepositorySearchDSL";

const defaultFormattedDSL: RepositorySearchDSL<ProductModel> = {
    pagination: {
        pageNumber: 1,
        itemsPerPage: 15
    },
    sorting: {
        field: "createdAt",
        direction: "desc"
    },
    filter: {
        field: "name",
        value: ""
    }
};

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
    let mockQueryFormatter: MockSearchQueryFormatter<ProductModel>;

    let result: SearchProductOutput;

    beforeEach (() => {
        mockRepository = new MockProductRepository();
        mockQueryFormatter = new MockSearchQueryFormatter();        
        sut = new SearchProductUseCaseImpl(mockRepository, mockQueryFormatter);
    });

    type Case = {
        description: string,
        input: SearchProductInput,
        queryFormatterOutput: RepositorySearchDSL<ProductModel>,
        repoOutput: RepositorySearchResult<ProductModel>,
        expected: SearchProductOutput
    };

    const specificCases: Case[] = [
        {
            description: "should return default search result when input is empty",
            input: {},
            queryFormatterOutput: { ...defaultFormattedDSL },
            repoOutput: { ...defaultRepoOutput },
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
            queryFormatterOutput: { ...defaultFormattedDSL },
            repoOutput: { ...defaultRepoOutput },
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
            queryFormatterOutput: {
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
            repoOutput: {
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

    specificCases.forEach(({ description, input, queryFormatterOutput, repoOutput, expected }) => {
        it (description, async () => {        
            mockQueryFormatter.formatInput.mockReturnValue(queryFormatterOutput)
            mockRepository.search.mockResolvedValue(repoOutput);

            result = await sut.execute(input);
            
            expect (result).toEqual(expect.objectContaining(expected));
            expect (mockQueryFormatter.formatInput).toHaveBeenCalledExactlyOnceWith(input)
            expect (mockRepository.search).toHaveBeenCalledExactlyOnceWith(queryFormatterOutput);
        });
    });

    it ("should throw an InternalError when query formatter throws an unexpected error.", async () => {
        mockQueryFormatter.formatInput.mockImplementation(() => { throw new Error("Example") });

        await expect (sut.execute({})).rejects.toBeInstanceOf(InternalError);

        expect (mockQueryFormatter.formatInput).toHaveBeenCalledExactlyOnceWith({});
        expect (mockRepository.search).not.toHaveBeenCalled();
    });

    it ("should throw an InternalError when repository throws an unexpected error.", async () => {
        mockQueryFormatter.formatInput.mockReturnValue(defaultFormattedDSL);

        await expect (sut.execute({})).rejects.toBeInstanceOf(InternalError);

        expect (mockQueryFormatter.formatInput).toHaveBeenCalledExactlyOnceWith({});
        expect (mockRepository.search).toHaveBeenCalledExactlyOnceWith(defaultFormattedDSL);
    });
});