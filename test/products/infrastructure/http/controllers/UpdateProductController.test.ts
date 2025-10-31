import { MockUpdateProductUseCase } from "./ProductUseCase.mock";
import { Request, Response } from "express";
import { ConflictError, InternalError, NotFoundError } from "@/common/domain/errors/httpErrors";
import productOutputBuilder from "@/products/infrastructure/testing/productOutputBuilder";
import productInputBuilder from "@/products/infrastructure/testing/productInputBuilder";
import type ProductOutput from "@/products/application/usecases/default/ProductOutput";
import UpdateProductController from "@/products/infrastructure/http/controllers/UpdateProductController";
import { randomUUID } from "node:crypto";

let sut: UpdateProductController;
let mockUseCase: MockUpdateProductUseCase;

let req: Partial<Request>;
let res: Partial<Response>;

describe ("UpdateProductController Test.", () => {
    beforeEach (() => {
        mockUseCase = new MockUpdateProductUseCase();
        sut = new UpdateProductController(mockUseCase);
        req = {
            body: productInputBuilder({}),
            params: {
                id: randomUUID()
            }
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
    });
    
    [["quantity", -2], ["quantity", 3.9], ["quantity", 0], ["price", -7.89], ["price", 0.0]].forEach(([field, value]) => {
        it (`should return a response error with code 400 when product ${field} is defined and invalid.`, async () => {
            req.body = productInputBuilder({ [field]: value });
            await sut.handle(req as Request, res as Response);
            expect (mockUseCase.execute).not.toHaveBeenCalled();
            expect (res.status).toHaveBeenCalledExactlyOnceWith(400);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });

    [undefined, "fake-id", ""].forEach((expectedValue) => {
        it (`should return a response error with code 400 when id is undefined or invalid.`, async () => {
            req.params.id = expectedValue;
            await sut.handle(req as Request, res as Response);
            expect (mockUseCase.execute).not.toHaveBeenCalled();
            expect (res.status).toHaveBeenCalledExactlyOnceWith(400);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });

    ["name", "quantity", "price"].forEach((field) => {
        it (`should not return a response error with code 400 when product ${field} is undefined.`, async () => {
            req.body = productInputBuilder({ [field]: undefined });
            await sut.handle(req as Request, res as Response);
            expect (mockUseCase.execute).toHaveBeenCalledExactlyOnceWith({
                 id: req.params.id, ...req.body 
            });
            expect (res.status).not.toHaveBeenCalledWith(400);
            expect (res.json).toHaveBeenCalledOnce();
        });
    });

    [
        { useCaseError: new InternalError("Example"), statusCode: 500, occasion: "usecase throws an unexpected error" },
        { useCaseError: new NotFoundError("Example"), statusCode: 404, occasion: "product is not found by id" },
        { useCaseError: new ConflictError("Example"), statusCode: 409, occasion: "product name already exists" }
    ].forEach(({ useCaseError, statusCode, occasion }) => {
        it (`should return a response error with code ${statusCode} when ${occasion}.`, async () => {
            mockUseCase.execute.mockRejectedValue(useCaseError);
            await sut.handle(req as Request, res as Response);
            expect (mockUseCase.execute).toHaveBeenCalledWith({
                id: req.params.id, ...req.body
            });
            expect (res.status).toHaveBeenCalledExactlyOnceWith(statusCode);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });

    [
        { name: "" }, { name: "name" },
        { name: "New Name" }, { name: undefined },
        { price: 1 }, { price: 499.93 }, { price: undefined },
        { quantity: 1 }, { quantity: 523 }, { quantity: undefined }
        
    ]
    .forEach((specificInput) => {
        it (`should return a response product json object with code 200 when product updated successfully.`, async () => {
            req.body = productInputBuilder({ ...specificInput });
            const useCaseOutput: ProductOutput = productOutputBuilder({ ...req.body });
            mockUseCase.execute.mockResolvedValue(useCaseOutput);
            await sut.handle(req as Request, res as Response);
            expect (mockUseCase.execute).toHaveBeenCalledExactlyOnceWith({
                id: req.params.id, ...req.body
            });
            expect (res.status).toHaveBeenCalledExactlyOnceWith(200);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({
                message: expect.stringContaining(""), data: useCaseOutput
            });
        });
    });
});