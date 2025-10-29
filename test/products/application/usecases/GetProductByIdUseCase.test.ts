import { NotFoundError } from "@/common/domain/errors/httpErrors";
import { randomUUID } from "node:crypto";
import GetProductByIdUseCaseImpl from "@/products/application/usecases/getProductById/GetProductByIdUseCaseImpl";
import MockProductRepository from "./ProductRepository.mock";
import productDataBuilder from "@/products/infrastructure/testing/productDataBuilder";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type GetProductByIdProductInput from "@/products/application/usecases/getProductById/GetProductByIdInput";
import type ProductOutputDTO from "@/products/application/ProductOutput";

let sut: GetProductByIdUseCaseImpl;
let mockRepository: ProductRepository;

let productInputData: GetProductByIdProductInput;
let productOutputData: ProductOutputDTO;

describe ("GetProductByIdUseCaseImpl Test.", () => {
    beforeEach (() => {
        mockRepository = new MockProductRepository();
         sut = new GetProductByIdUseCaseImpl(mockRepository);
    });

    it ("should throw an NotFoundError when product is not found by id.", async () => {
        productInputData = { id: "fake-id" };
        mockRepository.findById = vi.fn().mockResolvedValue(null);
        await expect (() => sut.execute(productInputData)).rejects.toBeInstanceOf(NotFoundError);
    });

    it ("should return a product found by id.", async () => {
        productInputData = { id: randomUUID() };
        productOutputData = productDataBuilder({ ...productInputData });
        mockRepository.findById = vi.fn().mockResolvedValue(productOutputData);
        const result: ProductOutputDTO = await sut.execute(productInputData);
        expect (result).toEqual(productOutputData);
    });
});