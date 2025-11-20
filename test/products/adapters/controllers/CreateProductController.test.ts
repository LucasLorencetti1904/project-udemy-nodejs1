import CreateProductController from "@/products/adapters/controllers/CreateProductController";
import { MockCreateProductUseCase } from "./ProductUseCase.mock";
import type { ProductOutput } from "@/products/application/dto/productIo";
import TestingProductFactory from "test/testingTools/testingFactories/TestingProductFactory";
import { Request, Response } from "express";
import { ConflictError, InternalError } from "@/common/domain/errors/httpErrors";

let sut: CreateProductController;
let mockUseCase: MockCreateProductUseCase;

let req: Partial<Request>;
let res: Partial<Response>;

describe ("CreateProductController Test.", () => {
    beforeEach (() => {
        mockUseCase = new MockCreateProductUseCase();
        sut = new CreateProductController(mockUseCase);

        req = {
            body: undefined
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
    });
    
    [["quantity", -2], ["quantity", 3.9], ["quantity", 0], ["price", -7.89], ["price", 0.0]].forEach(([field, value]) => {
        it (`should return a response error with code 400 when product ${field} is invalid.`, async () => {
            req.body = TestingProductFactory.createInput({ [field]: value });

            await sut.handle(req as Request, res as Response);

            expect (mockUseCase.execute).not.toHaveBeenCalled();
            expect (res.status).toHaveBeenCalledExactlyOnceWith(400);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });

    it ("should return a response error with code 400 when product contains invalid fields.", async () => {
        req.body = { ...TestingProductFactory.createInput({}), unexpectedField: "Unexpected Value" };
        
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
            req.body = TestingProductFactory.createInput({});
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
            req.body = TestingProductFactory.createInput({ ...specificInput });
            const useCaseOutput: ProductOutput = TestingProductFactory.output({ ...req.body });
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