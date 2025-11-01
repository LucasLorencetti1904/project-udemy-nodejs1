import { BadRequestError, InternalError, NotFoundError } from "@/common/domain/errors/httpErrors";
import { randomUUID } from "node:crypto";
import MockProductRepository from "./ProductRepository.mock";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import DeleteProductByIdUseCase from "@/products/application/usecases/deleteProductById/DeleteProductByIdUseCase";
import DeleteProductByIdUseCaseImpl from "@/products/application/usecases/deleteProductById/DeleteProductByIdUseCaseImpl";
import type DeleteProductByIdInput from "@/products/application/usecases/deleteProductById/DeleteProductByIdInput";
import productModelBuilder from "@/products/infrastructure/testing/productModelBuilder";
import type ProductModel from "@/products/domain/models/ProductModel";

let sut: DeleteProductByIdUseCase;
let mockRepository: ProductRepository;

let productInputData: DeleteProductByIdInput;

describe ("DeleteProductByIdUseCaseImpl Test.", () => {
    beforeEach (() => {
        mockRepository = new MockProductRepository();
         sut = new DeleteProductByIdUseCaseImpl(mockRepository);
    });

    it ("should throw an BadRequestError when id is invalid.", async () => {
        productInputData = "fake-id";
        await expect (sut.execute(productInputData)).rejects.toBeInstanceOf(BadRequestError);
        expect (mockRepository.delete).not.toHaveBeenCalled();
    });

    [
        {
            mockResult: vi.fn().mockResolvedValue(null),
            expectedErrorInstance: NotFoundError,
            occasion: "product is not found by id"
        },
        {
            mockResult: vi.fn().mockRejectedValue(new Error()),
            expectedErrorInstance: InternalError,
            occasion: "repository throws an unexpected error"
        },        
    ]
    .forEach(({ mockResult, expectedErrorInstance, occasion }) => {
        it (`should throw an ${expectedErrorInstance.name} when ${occasion}.`, async () => {
            productInputData = randomUUID();
            mockRepository.delete = mockResult;
            await expect (sut.execute(productInputData)).rejects.toBeInstanceOf(expectedErrorInstance);
            expect (mockRepository.delete).toHaveBeenCalledExactlyOnceWith(productInputData);
        });
    });

    it ("should delete product found by id.", async () => {
        productInputData = randomUUID();
        const deletedProduct: ProductModel = productModelBuilder({ id: productInputData })
        mockRepository.delete = vi.fn().mockResolvedValue(deletedProduct);
        await expect(sut.execute(productInputData)).resolves.toEqual(deletedProduct);
        expect (mockRepository.delete).toHaveBeenCalledExactlyOnceWith(productInputData);
    });
});