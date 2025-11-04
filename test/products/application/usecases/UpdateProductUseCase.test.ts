import { BadRequestError, ConflictError, InternalError, NotFoundError } from "@/common/domain/errors/httpErrors";
import MockProductRepository from "./ProductRepository.mock";
import { updateProductInputBuilder } from "@/products/infrastructure/testing/productInputBuilder";
import type { ProductOutput } from "@/products/application/dto/productIo";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import UpdateProductUseCaseImpl from "@/products/application/usecases/updateProduct/UpdateProductUseCaseImpl";
import type UpdateProductInput from "@/products/application/dto/UpdateProductInput";
import { randomUUID } from "node:crypto";
import type ProductModel from "@/products/domain/models/ProductModel";
import productModelBuilder from "@/products/infrastructure/testing/productModelBuilder";
import productOutputBuilder from "@/products/infrastructure/testing/productOutputBuilder";

let sut: UpdateProductUseCaseImpl;
let mockRepository: ProductRepository;

let productInputData: UpdateProductInput;
let productOutputData: ProductOutput;

describe ("UpdateProductUseCaseImpl Test.", () => {
    beforeEach (() => {
        mockRepository = new MockProductRepository();
        sut = new UpdateProductUseCaseImpl(mockRepository);
    });

    [
        { field: "id", value: "fake-id" },
        { field: "price", value: 0 },
        { field: "quantity", value: 0 },
    ].forEach(({ field, value }) => {
        it (`should throw BadRequestError when product ${field} is defined and invalid.`, async () => {
            productInputData = updateProductInputBuilder({ [field]: value })
            await expect (sut.execute(productInputData)).rejects.toBeInstanceOf(BadRequestError);

            ["findByName", "findById", "update"].forEach((method) => {
                expect (mockRepository[method]).not.toHaveBeenCalled();
            });
        });
    });

    ["name", "price", "quantity"].forEach((field) => {
        it (`should not throw BadRequestError when product ${field} is undefined.`, async () => {
            productInputData = updateProductInputBuilder({ [field]: undefined })
            await expect (sut.execute(productInputData)).rejects.not.toBeInstanceOf(BadRequestError);
        });
    });

    it ("should throw ConflictError when product name already exists.", async () => {
        productInputData = updateProductInputBuilder({ name: "Existent Product" });
        mockRepository.findByName = vi.fn().mockResolvedValue(productInputData.name);
        await expect ((sut.execute(productInputData))).rejects.toBeInstanceOf(ConflictError);

        expect (mockRepository.findByName).toHaveBeenCalledExactlyOnceWith(productInputData.name);
        expect (mockRepository.findById).not.toHaveBeenCalled();
        expect (mockRepository.update).not.toHaveBeenCalled();
    });

    it ("should throw an NotFoundError when product is not found by id.", async () => {
        productInputData = updateProductInputBuilder({ id: randomUUID() });
        mockRepository.findById = vi.fn().mockResolvedValue(null);
        await expect (sut.execute(productInputData)).rejects.toBeInstanceOf(NotFoundError);

        expect (mockRepository.findByName).toHaveBeenCalledExactlyOnceWith(productInputData.name);
        expect (mockRepository.findById).toHaveBeenCalledExactlyOnceWith(productInputData.id);
        expect (mockRepository.update).not.toHaveBeenCalled();
    });

    ["findByName", "findById", "update"].forEach((method) => {
        it ("should throw an InternalError when repository throws an unexpected error.", async () => {
            mockRepository.findById = vi.fn().mockResolvedValue(productOutputBuilder({}));
            mockRepository[method] = vi.fn().mockRejectedValue(new Error());
            await expect (sut.execute(productInputData)).rejects.toBeInstanceOf(InternalError);
        });
    });

    it ("should not search by name when input name is undefined.", async () => {
        productInputData = { ...updateProductInputBuilder({}), name: undefined };
        try { await sut.execute(productInputData); } catch {}
        expect (mockRepository.findByName).not.toHaveBeenCalled();
    });

    const updateTestingCases: Record<string, any>[] = [
        { field: "name", oldValue: "Old Name", newValue: "New Name" },
        { field: "name", oldValue: "Name", newValue: "Nameee" },
        { field: "price", oldValue: 1, newValue: 2.32 },
        { field: "price", oldValue: 92.43, newValue: 84 },
        { field: "quantity", oldValue: 1, newValue: 3 },
        { field: "quantity", oldValue: 932, newValue: 927 },
    ];
    
    updateTestingCases.forEach(({ field, oldValue, newValue }) => {
        it ("should return a updated product when input data is defined and valid.", async () => {
            productInputData = updateProductInputBuilder({ [field]: newValue });
            const oldProduct: ProductModel = productModelBuilder({
                ...productInputData, [field]: oldValue
            });
            productOutputData = { ...oldProduct, [field]: productInputData[field] };
            mockRepository.findById = vi.fn().mockResolvedValue(oldProduct)
            mockRepository.findByName = vi.fn().mockResolvedValue(null);
            mockRepository.update = vi.fn().mockReturnValue(productOutputData);
            await expect ((sut.execute(productInputData))).resolves.toEqual(productOutputData);
    
            [
                { method: "findByName" , expectedValue: productInputData.name },
                { method: "findById" , expectedValue: productInputData.id },
                { method: "update" , expectedValue: { ...oldProduct, ...productInputData } }
            ]
            .forEach(({ method, expectedValue }) => {
                expect (mockRepository[method]).toHaveBeenCalledExactlyOnceWith(expectedValue);
            });
        });
    });

    updateTestingCases.forEach(({ field, oldValue, newValue }) => {
        it ("should return a updated product even when most input values are undefined.", async () => {
            productInputData = {
                id: randomUUID(), quantity: undefined, price: undefined, name: undefined
            };
            productInputData[field] = newValue;
            const oldProduct: ProductModel = productModelBuilder({
                id: productInputData.id, [field]: oldValue
            });
            productOutputData = { ...oldProduct, [field]: productInputData[field] };
            mockRepository.findById = vi.fn().mockResolvedValue(oldProduct)
            mockRepository.findByName = vi.fn().mockResolvedValue(null);
            mockRepository.update = vi.fn().mockReturnValue(productOutputData);
            await expect ((sut.execute(productInputData))).resolves.toEqual(productOutputData);
            
            if (productInputData.name != undefined) {
                expect (mockRepository.findByName)
                    .toHaveBeenCalledExactlyOnceWith(productInputData.name);
            } else {
                expect (mockRepository.findByName).not.toHaveBeenCalled();
            }

            expect (mockRepository.findById).toHaveBeenCalledExactlyOnceWith(productInputData.id);
            expect (mockRepository.update).toHaveBeenCalledExactlyOnceWith({
                ...oldProduct, [field]: productInputData[field]
            });
        });
    });
});