import { BadRequestError, InternalError, NotFoundError } from "@/common/domain/errors/httpErrors";
import { randomUUID } from "node:crypto";
import GetProductByIdUseCaseImpl from "@/products/application/usecases/getProductById/GetProductByIdUseCaseImpl";
import MockProductRepository from "./ProductRepository.mock";
import productOutputBuilder from "@/products/infrastructure/testing/productOutputBuilder";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type GetProductByIdProductInput from "@/products/application/usecases/getProductById/GetProductByIdInput";
import type ProductOutputDTO from "@/products/application/usecases/default/ProductOutput";

let sut: GetProductByIdUseCaseImpl;
let mockRepository: ProductRepository;

let productInputData: GetProductByIdProductInput;
let productOutputData: ProductOutputDTO;

describe ("GetProductByIdUseCaseImpl Test.", () => {
    beforeEach (() => {
        mockRepository = new MockProductRepository();
         sut = new GetProductByIdUseCaseImpl(mockRepository);
    });

    it ("should throw an BadRequestError when id is invalid.", async () => {
        productInputData = "fake-id";
        await expect (sut.execute(productInputData)).rejects.toBeInstanceOf(BadRequestError);
        expect (mockRepository.findById).not.toHaveBeenCalled();
    });

    [
        {
            mockResult: vi.fn().mockResolvedValue(null),
            expectedErrorInstance: NotFoundError,
            occasion: "repository throws an unexpected error"
        },
        {
            mockResult: vi.fn().mockRejectedValue(new Error()),
            expectedErrorInstance: InternalError,
            occasion: "product is not found by id"
        },        
    ]
    .forEach(({ mockResult, expectedErrorInstance, occasion }) => {
        it (`should throw an ${expectedErrorInstance.name} when ${occasion}.`, async () => {
            productInputData = randomUUID();
            mockRepository.findById = mockResult;
            await expect (sut.execute(productInputData)).rejects.toBeInstanceOf(expectedErrorInstance);
            expect (mockRepository.findById).toHaveBeenCalledExactlyOnceWith(productInputData);
        });
    });

    it ("should return a product found by id.", async () => {
        productInputData = randomUUID();
        productOutputData = productOutputBuilder({ id: productInputData });
        mockRepository.findById = vi.fn().mockResolvedValue(productOutputData);
        const result: ProductOutputDTO = await sut.execute(productInputData);
        expect (result).toEqual(productOutputData);
        expect (mockRepository.findById).toHaveBeenCalledExactlyOnceWith(productInputData);
    });
});