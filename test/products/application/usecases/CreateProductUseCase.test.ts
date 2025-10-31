import { BadRequestError, ConflictError, InternalError } from "@/common/domain/errors/httpErrors";
import CreateProductUseCaseImpl from "@/products/application/usecases/createProduct/CreateProductUseCaseImpl";
import MockProductRepository from "./ProductRepository.mock";
import { createProductInputBuilder } from "@/products/infrastructure/testing/productInputBuilder";
import productOutputBuilder from "@/products/infrastructure/testing/productOutputBuilder";
import type CreateProductInput from "@/products/application/usecases/createProduct/CreateProductInput";
import type ProductOutputDTO from "@/products/application/usecases/default/ProductOutput";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";

let sut: CreateProductUseCaseImpl;
let mockRepository: ProductRepository;

let productInputData: CreateProductInput;
let productOutputData: ProductOutputDTO;

describe ("CreateProductUseCaseImpl Test.", () => {
    beforeEach (() => {
        mockRepository = new MockProductRepository();
        sut = new CreateProductUseCaseImpl(mockRepository);
    });

    [
        { field: "name", wrong: "empty", value: "" },
        { field: "price", wrong: "invalid", value: 0 },
        { field: "quantity", wrong: "invalid", value: 0 },
    ]
    .forEach(({ field, wrong, value }) => {
        it (`should throw BadRequestError when product ${field} is ${wrong}.`, async () => {
            productInputData = createProductInputBuilder({ [field]: value })
            await expect (sut.execute(productInputData)).rejects.toBeInstanceOf(BadRequestError);
            
            ["findByName", "create", "insert"].forEach((method) => {
                expect (mockRepository[method]).not.toHaveBeenCalled();
            })
        });
    });

    it ("should throw ConflictError when product name already exists.", async () => {
        productInputData = createProductInputBuilder({ name: "Existent Product" });
        mockRepository.findByName = vi.fn().mockResolvedValue(productInputData.name);
        await expect ((sut.execute(productInputData))).rejects.toBeInstanceOf(ConflictError);
        
        expect (mockRepository.findByName).toHaveBeenCalledExactlyOnceWith(productInputData.name);
        expect (mockRepository.create).not.toHaveBeenCalled();
        expect (mockRepository.insert).not.toHaveBeenCalled();
    });

    [
        { method: "findByName", mockResult: vi.fn().mockRejectedValue(new Error()) },
        { method: "create", mockResult: vi.fn(() => { throw new Error() }) },
        { method: "insert", mockResult: vi.fn().mockRejectedValue(new Error()) }
    ]
    .forEach(({ method, mockResult }) => {
        it (`should throw an InternalError when method '${method}' of repository throws an unexpected error.`, async () => {
            mockRepository[method as any] = mockResult;
            await expect (sut.execute(productInputData)).rejects.toBeInstanceOf(InternalError);
        });
    });

    [
        { name: "Product" }, { name: "New Product" },
        { price: 1 }, { price: 322.99 },
        { quantity: 1 }, { quantity: 812 }
    ]
    .forEach((specificInput) => {
        it ("should return a new product when input data is valid.", async () => {
            productInputData = createProductInputBuilder({ ...specificInput });
            productOutputData = productOutputBuilder({ ...productInputData });
            mockRepository.findByName = vi.fn().mockResolvedValue(null);
            mockRepository.create = vi.fn().mockReturnValue(productOutputData);
            await expect ((sut.execute(productInputData))).resolves.toEqual(productOutputData);
    
            [
                { method: "findByName", expectedValue: productInputData.name },
                { method: "create", expectedValue: productInputData },
                { method: "insert", expectedValue: productOutputData }
            ]
            .forEach(({method, expectedValue}) => {
                expect (mockRepository[method as keyof MockProductRepository])
                    .toHaveBeenCalledExactlyOnceWith(expectedValue);
            });
        });
    });
});