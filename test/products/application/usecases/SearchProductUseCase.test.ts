import type { SearchProductInput, SearchProductOutput } from "@/products/application/usecases/searchProduct/SearchProdutIo";
import MockProductRepository from "./ProductRepository.mock";
import type ProductModel from "@/products/domain/models/ProductModel";
import productModelBuilder from "@/products/infrastructure/testing/productModelBuilder";
import type { RepostitorySearchOutput } from "@/common/domain/repositories/Repository";
import type SearchProductUseCase from "@/products/application/usecases/searchProduct/SeachProductUseCase";
import SearchProductUseCaseImpl from "@/products/application/usecases/searchProduct/SeachProductUseCaseImpl";

function randomInt(n: number): number {
    return Math.floor(Math.random() * n) + 1;
}

describe ("SearchProductUseCase Test", () => {  
    let sut: SearchProductUseCase;
    let mockRepository: MockProductRepository;

    let models: ProductModel[];

    let repoOutput: RepostitorySearchOutput<ProductModel>;
    let useCaseOutput: SearchProductOutput;

    let result: SearchProductOutput;

    beforeEach (() => {
        mockRepository = new MockProductRepository();
        sut = new SearchProductUseCaseImpl(mockRepository);
    });

    const defaultInputProps: SearchProductInput = {
        page: 1,
        perPage: 15,
        sort: "createdAt",
        sortDir: "desc",
        filter: ""
    };

    const inputs: SearchProductInput[] = [
        { ...defaultInputProps },
        { ...defaultInputProps, page: randomInt(15), perPage: randomInt(15) },
        { ...defaultInputProps, sort: "name" },
        { ...defaultInputProps, sortDir: "asc" },
        { ...defaultInputProps, filter: "am" },
        { page: randomInt(15), perPage: randomInt(15), sort: "name", sortDir: "asc", filter: "am" }
    ];

    inputs.forEach((input) => {
        it (`should apply only paginate ${input.page} with ${input.perPage} per page, sorted by ${input.sortDir} '${input.sort}' items (${input.filter ? "with" : "no"} filter).`, async () => {
            if (input.filter) {
                models = [
                    productModelBuilder({ name: "EXAMPLE" }),
                    productModelBuilder({ name: "Test" }),
                    productModelBuilder({ name: "example" })
                ];
            }
            else {
                models = Array(50).fill(productModelBuilder({}));
            }
            
            const firstIndex: number = (input.page - 1) * input.perPage;
            const lastIndex: number = firstIndex + input.perPage
    
            repoOutput = {
                currentPage: input.page,
                perPage: input.perPage,
                sort: input.sort,
                sortDir: input.sortDir,
                filter: input.filter,
                total: models.length,
                items: models.slice(firstIndex, lastIndex),
            };

            useCaseOutput = {
                currentPage: repoOutput.currentPage,
                perPage: repoOutput.perPage,
                lastPage: Math.ceil(repoOutput.total / repoOutput.perPage),
                total: repoOutput.total,
                items: repoOutput.items
            };            
    
            mockRepository.search.mockResolvedValue(repoOutput);
            result = await sut.execute(input);
            expect (result).toEqual(useCaseOutput);
            expect (mockRepository.search).toHaveBeenCalledExactlyOnceWith(input);
        });
    });
});