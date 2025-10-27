import { BadRequestError, ConflictError } from "@/common/domain/errors/httpErrors";
import { CreateProductUseCase } from "@/products/application/usecases/impl/CreateProductUseCaseImpl";
import ProductRepository from "@/products/domain/repositories/ProductRepository";
import MockProductRepository from "./ProductRepository.mock";
import { CreateProductInput, CreateProductOutput } from "@/products/application/dto/CreateProductIoDto";
import createProductInputBuilder from "@/products/infrastructure/testing/productInputBuilder";
import productDataBuilder from "@/products/infrastructure/testing/productDataBuilder";

let sut: CreateProductUseCase;
let mockRepository: ProductRepository;

let productInputData: CreateProductInput;
let productOutputData: CreateProductOutput;

describe ("CreateProductUseCase Test.", () => {
    beforeEach (() => {
        mockRepository = new MockProductRepository();
        sut = new CreateProductUseCase(mockRepository);
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