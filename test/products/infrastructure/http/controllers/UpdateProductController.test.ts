import { MockUpdateProductUseCase } from "./ProductUseCase.mock";
import { Request, Response } from "express";
import { ConflictError, InternalError, NotFoundError } from "@/common/domain/errors/httpErrors";
import productOutputBuilder from "@/products/infrastructure/testing/productOutputBuilder";
import { updateProductInputBuilder } from "@/products/infrastructure/testing/productInputBuilder";
import type ProductOutput from "@/products/application/usecases/default/ProductOutput";

let sut: UpdateProductController;
let mockUseCase: MockUpdateProductUseCase;

let req: Partial<Request>;
let res: Partial<Response>;

describe ("UpdateProductController Test.", () => {
    beforeEach (() => {
        mockUseCase = new MockUpdateProductUseCase();
        sut = new UpdateProductController(mockUseCase);
        req = {
            body: updateProductInputBuilder({})
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
    });
    
    [["id", ""], ["quantity", -2], ["price", 0.0]].forEach(([field, value]) => {
        it (`should return a response error with code 400 when product ${field} is invalid.`, async () => {
            req.body = updateProductInputBuilder({ [field]: value });
            await sut.handle(req as Request, res as Response);
            expect (mockUseCase.execute).not.toHaveBeenCalled();
            expect (res.status).toHaveBeenCalledExactlyOnceWith(400);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });

    ["name", "quantity", "price"].forEach(([field]) => {
        it (`should not return a response error with code 400 when product ${field} is undefined.`, async () => {
            req.body = updateProductInputBuilder({ [field]: undefined });
            await sut.handle(req as Request, res as Response);
            expect (mockUseCase.execute).toHaveBeenCalledExactlyOnceWith(req.body);
            expect (res.status).not.toHaveBeenCalledWith(400);
            expect (res.json).toHaveBeenCalledOnce();
        });
    });

    [
        { useCaseError: new InternalError("Example"), statusCode: 500, occasion: "usecase throws an unexpected error" },
        { useCaseError: new NotFoundError("Example"), status: 404, occasion: "product is not found by id" },
        { useCaseError: new ConflictError("Example"), statusCode: 409, occasion: "product name already exists" }
    ].forEach(({ useCaseError, statusCode, occasion }) => {
        it (`should return a response error with code ${statusCode} when ${occasion}.`, async () => {
            mockUseCase.execute.mockRejectedValue(useCaseError);
            await sut.handle(req as Request, res as Response);
            expect (mockUseCase.execute).toHaveBeenCalledWith(req.body);
            expect (res.status).toHaveBeenCalledExactlyOnceWith(statusCode);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });

    it (`should return a response product json object with code 200 when product updated successfully.`, async () => {
        const useCaseOutput: ProductOutput = productOutputBuilder({ ...req.body });
        mockUseCase.execute.mockResolvedValue(useCaseOutput);
        await sut.handle(req as Request, res as Response);
        expect (mockUseCase.execute).toHaveBeenCalledExactlyOnceWith(req.body);
        expect (res.status).toHaveBeenCalledExactlyOnceWith(200);
        expect (res.json).toHaveBeenCalledExactlyOnceWith({
            message: expect.stringContaining(""), data: useCaseOutput
        });
    });
});