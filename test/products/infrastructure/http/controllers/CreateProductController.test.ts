import CreateProductController from "@/products/infrastructure/http/controllers/CreateProductController";
import { MockCreateProductUseCase } from "./ProductUseCase.mock";
import { Request, Response } from "express";
import { ConflictError, InternalError } from "@/common/domain/errors/httpErrors";
import productOutputBuilder from "@/products/infrastructure/testing/productOutputBuilder";
import { createProductInputBuilder } from "@/products/infrastructure/testing/productInputBuilder";
import type { ProductOutput } from "@/products/application/dto/productIo";

let sut: CreateProductController;
let mockUseCase: MockCreateProductUseCase;

let req: Partial<Request>;
let res: Partial<Response>;

describe ("CreateProductController Test.", () => {
    beforeEach (() => {
        mockUseCase = new MockCreateProductUseCase();
        sut = new CreateProductController(mockUseCase);
        req = {
            body: createProductInputBuilder({})
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
    });
    
    [["quantity", -2], ["quantity", 3.9], ["quantity", 0], ["price", -7.89], ["price", 0.0]].forEach(([field, value]) => {
        it (`should return a response error with code 400 when product ${field} is invalid.`, async () => {
            req.body = createProductInputBuilder({ [field]: value });
            await sut.handle(req as Request, res as Response);
            expect (mockUseCase.execute).not.toHaveBeenCalled();
            expect (res.status).toHaveBeenCalledExactlyOnceWith(400);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });

    it ("should return a response error with code 400 when product contains invalid fields.", async () => {
        req.body = { ...createProductInputBuilder({}), unexpectedField: "Unexpected Value" };
        await sut.handle(req as Request, res as Response);
        expect (mockUseCase.execute).not.toHaveBeenCalled();
        expect (res.status).toHaveBeenCalledExactlyOnceWith(400);
        expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
    });

    [
        { useCaseError: new InternalError("Example"), statusCode: 500, occasion: "usecase throws an unexpected error" },
        { useCaseError: new ConflictError("Example"), statusCode: 409, occasion: "product name already exists" }
    ].forEach(({ useCaseError, statusCode, occasion }) => {
        it (`should return a response error with code ${statusCode} when ${occasion}.`, async () => {
            mockUseCase.execute.mockRejectedValue(useCaseError);
            await sut.handle(req as Request, res as Response);
            expect (mockUseCase.execute).toHaveBeenCalledExactlyOnceWith(req.body);
            expect (res.status).toHaveBeenCalledExactlyOnceWith(statusCode);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });


    [
        { name: "name" }, { name: "New Name" },
        { price: 1 }, { price: 499.93 },
        { quantity: 1 }, { quantity: 523 }
    ]
    .forEach((specificInput) => {
        it (`should return a response product json object with code 201 when product registered successfully.`, async () => {
            req.body = createProductInputBuilder({ ...specificInput });
            const useCaseOutput: ProductOutput = productOutputBuilder({ ...req.body });
            mockUseCase.execute.mockResolvedValue(useCaseOutput);
            await sut.handle(req as Request, res as Response);
            expect (mockUseCase.execute).toHaveBeenCalledExactlyOnceWith(req.body);
            expect (res.status).toHaveBeenCalledExactlyOnceWith(201);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({
                message: expect.stringContaining(""), data: useCaseOutput
            });
        });
    });
});