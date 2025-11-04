import type { SearchProductInput, SearchProductOutput } from "@/products/application/dto/searchProdutIo";
import MockProductRepository from "./ProductRepository.mock";
import type ProductModel from "@/products/domain/models/ProductModel";
import productModelBuilder from "@/products/infrastructure/testing/productModelBuilder";
import type { RepositorySearchOutput } from "@/common/domain/repositories/repositoryIo";
import type SearchProductUseCase from "@/products/application/usecases/searchProduct/SeachProductUseCase";
import SearchProductUseCaseImpl from "@/products/application/usecases/searchProduct/SeachProductUseCaseImpl";
import { InternalError } from "@/common/domain/errors/httpErrors";

describe ("SearchProductUseCase Test", () => {  
    let sut: SearchProductUseCase;
    let mockRepository: MockProductRepository;

    let models: ProductModel[] = Array(50).fill(productModelBuilder({}));
    let exampleOfModel: ProductModel = productModelBuilder({});

    let defaultRepoOutput: RepositorySearchOutput<ProductModel>;
    let repoOutput: RepositorySearchOutput<ProductModel>;

    let result: SearchProductOutput;

    beforeEach (() => {
        mockRepository = new MockProductRepository();
        sut = new SearchProductUseCaseImpl(mockRepository);
        
        models = Array(50).fill(productModelBuilder({ name: "Non" }));

        defaultRepoOutput = {
            currentPage: 1,
            perPage: 15,
            sort: "createdAt",
            sortDir: "desc",
            items: models.slice(24, 32),
            total: models.length,
            filter: ""
        };
    });

    type Case = {
        description: string,
        input: SearchProductInput,
        output: Partial<RepositorySearchOutput<ProductModel>>,
        expected: Partial<SearchProductOutput>
    };

    const specificCases: Case[] = [
        {
            description: "should return default pagination values.",
            input: {},
            output: { currentPage: 1, perPage: 15 },
            expected: { currentPage: 1, perPage: 15 }
        },
        {
            description: "should handle with default pagination values when invalid.",
            input: { page: -6, perPage: 9.22 },
            output: { currentPage: 1, perPage: 15 },
            expected: { currentPage: 1, perPage: 15 }
        },
        {
            description: "should return pagination values.",
            input: { page: 4, perPage: 8 },
            output: { currentPage: 4, perPage: 8 },
            expected: { currentPage: 4, perPage: 8 }
        },
        {
            description: "should return the number of last page.",
            input: { perPage: 5 },
            output: { total: 50, perPage: 5 },
            expected: { lastPage: 10 }
        },
        {
            description: "should always return last page 1 when it is 0.",
            input: {},
            output: { total: 0, perPage: 15 },
            expected: { lastPage: 1 }
        },
        {
            description: "should return the first 15 items by default.",
            input: {},
            output: { items: models.slice(0, 15) },
            expected: { items: models.slice(0, 15) }
        },
        {
            description: "should return 6 items of page 2.",
            input: { page: 2, perPage: 6 },
            output: { items: models.slice(6, 12) },
            expected: { items: models.slice(6, 12) }
        },
        {
            description: "should return the count of all items.",
            input: {},
            output: { total: 50 },
            expected: { total: 50 }
        },
        {
            description: "should return the count of filtered items.",
            input: { filter: "es" },
            output: { total: 2 },
            expected: { total: 2 }
        },
        {
            description: "should return the complex search result.",
            input: {
                page: 2,
                perPage: 25,
                sort: "name",
                sortDir: "asc",
                filter: "am"
            },
            output: {
                currentPage: 2,
                perPage: 25,
                sort: "name",
                sortDir: "asc",
                filter: "am", 
                total: 50,
                items: Array(3).fill(productModelBuilder({ ...exampleOfModel, name: "example" }))
            },
            expected: {
                currentPage: 2,
                perPage: 25,
                lastPage: 2,
                total: 50,
                items: Array(3).fill(productModelBuilder({ ...exampleOfModel, name: "example" }))
            }
        }
    ];

    specificCases.forEach(({ description, input, output, expected }) => {
        it (description, async () => {    
            repoOutput = {
                ...defaultRepoOutput,
                ...output
            };
    
            mockRepository.search.mockResolvedValue(repoOutput);
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