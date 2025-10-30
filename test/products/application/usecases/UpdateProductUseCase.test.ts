import { BadRequestError, ConflictError, InternalError, NotFoundError } from "@/common/domain/errors/httpErrors";
import MockProductRepository from "./ProductRepository.mock";
import { updateProductInputBuilder } from "@/products/infrastructure/testing/productInputBuilder";
import type ProductOutputDTO from "@/products/application/usecases/default/ProductOutput";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import UpdateProductUseCaseImpl from "@/products/application/usecases/updateProduct/UpdateProductUseCaseImpl";
import type UpdateProductInput from "@/products/application/usecases/updateProduct/UpdateProductInput";
import { randomUUID } from "node:crypto";
import type ProductModel from "@/products/domain/models/ProductModel";
import productModelBuilder from "@/products/infrastructure/testing/productModelBuilder";

let sut: UpdateProductUseCaseImpl;
let mockRepository: ProductRepository;

let productInputData: UpdateProductInput;
let productOutputData: ProductOutputDTO;

describe ("UpdateProductUseCaseImpl Test.", () => {
    beforeEach (() => {
        mockRepository = new MockProductRepository();
        sut = new UpdateProductUseCaseImpl(mockRepository);
    });

    [
        { field: "id", wrong: "invalid", value: "fake-id" },
        { field: "name", wrong: "empty", value: "" },
        { field: "price", wrong: "invalid", value: 0 },
        { field: "quantity", wrong: "invalid", value: 0 },
    ].forEach(({ field, wrong, value }) => {
        it (`should throw BadRequestError when product ${field} is ${wrong}.`, async () => {
            productInputData = updateProductInputBuilder({ [field]: value })
            await expect (sut.execute(productInputData)).rejects.toBeInstanceOf(BadRequestError);
        });
    });

    it ("should throw an NotFoundError when product is not found by id.", async () => {
        productInputData = updateProductInputBuilder({ id: randomUUID() });
        mockRepository.findById = vi.fn().mockResolvedValue(null);
        await expect (sut.execute(productInputData)).rejects.toBeInstanceOf(NotFoundError);
    });

    it ("should throw ConflictError when product name already exists.", async () => {
        productInputData = updateProductInputBuilder({ name: "Existent Product" });
        mockRepository.findByName = vi.fn().mockResolvedValue(productInputData.name);
        await expect ((sut.execute(productInputData))).rejects.toBeInstanceOf(ConflictError);
    });

    it ("should throw an InternalError when repository throws an unexpected error.", async () => {
        mockRepository.insert = vi.fn().mockRejectedValue(new Error());
        await expect (sut.execute(productInputData)).rejects.toBeInstanceOf(InternalError);
    });

    it ("should not search by name when input name is undefined.", async () => {
        productInputData = updateProductInputBuilder({ name: undefined });
        await sut.execute(productInputData);
        expect (mockRepository.findByName).not.toHaveBeenCalled();
    });    

    it ("should return a updated product when input data is valid.", async () => {
        const oldProduct: ProductModel = productModelBuilder({ name: "Old Product" });
        productInputData = { id: oldProduct.id, name: "New Product" };
        productOutputData = { ...oldProduct, name: productInputData.name };
        mockRepository.findByName = vi.fn().mockResolvedValue(null);
        mockRepository.update = vi.fn().mockReturnValue(productOutputData);
        await expect ((sut.execute(productInputData))).resolves.toEqual(productOutputData);
    });
});