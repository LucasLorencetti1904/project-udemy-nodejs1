import { BadRequestError, ConflictError } from "@/common/domain/errors/httpErrors";
import CreateProductUseCaseImpl from "@/products/application/usecases/createProduct/CreateProductUseCaseImpl";
import MockProductRepository from "./ProductRepository.mock";
import createProductInputBuilder from "@/products/infrastructure/testing/productInputBuilder";
import productDataBuilder from "@/products/infrastructure/testing/productDataBuilder";
import type CreateProductInput from "@/products/application/usecases/createProduct/CreateProductIoDto";
import type ProductOutputDTO from "@/products/application/ProductOutput";
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
    ].forEach(({ field, wrong, value }) => {
        it (`should throw BadRequestError when product ${field} is ${wrong}.`, async () => {
            productInputData = createProductInputBuilder({ [field]: value })
            await expect (sut.execute(productInputData)).rejects.toBeInstanceOf(BadRequestError);
        });
    });

    it ("should throw ConflictError when product name already exists.", async () => {
        productInputData = createProductInputBuilder({ name: "Existent Product" });
        mockRepository.findByName = vi.fn().mockResolvedValue(productInputData.name);
        await expect ((sut.execute(productInputData))).rejects.toBeInstanceOf(ConflictError);
    });

    it ("should return a new product when input data is valid.", async () => {
        productInputData = createProductInputBuilder({ name: "Existent Product" });
        productOutputData = productDataBuilder({ ...productInputData });
        mockRepository.findByName = vi.fn().mockResolvedValue(null);
        mockRepository.create = vi.fn().mockReturnValue(productOutputData);
        await expect ((sut.execute(productInputData))).resolves.toEqual(productOutputData);
    });
});