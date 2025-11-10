import GetProductByIdUseCaseImpl from "@/products/application/usecases/getProductById/GetProductByIdUseCaseImpl";
import MockProductRepository from "./ProductRepository.mock";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type GetProductByIdProductInput from "@/products/application/dto/GetProductByIdInput";
import type { ProductOutput } from "@/products/application/dto/productIo";
import TestingProductFactory from "test/products/testingHelpers/TestingProductFactory";
import { randomUUID } from "node:crypto";
import { InternalError, NotFoundError } from "@/common/domain/errors/httpErrors";

let sut: GetProductByIdUseCaseImpl;
let mockRepository: ProductRepository;

let productInputData: GetProductByIdProductInput;
let productOutputData: ProductOutput;

describe ("GetProductByIdUseCaseImpl Test.", () => {
    beforeEach (() => {
        mockRepository = new MockProductRepository();
         sut = new GetProductByIdUseCaseImpl(mockRepository);
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
        productOutputData = TestingProductFactory.output({ id: productInputData });
        mockRepository.findById = vi.fn().mockResolvedValue(productOutputData);

        const result: ProductOutput = await sut.execute(productInputData);

        expect (result).toEqual(productOutputData);
        expect (mockRepository.findById).toHaveBeenCalledExactlyOnceWith(productInputData);
    });
});