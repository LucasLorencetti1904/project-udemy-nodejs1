import { MockDeleteProductByIdUseCase, } from "./ProductUseCase.mock";
import { Request, Response } from "express";
import { InternalError, NotFoundError } from "@/common/domain/errors/httpErrors";
import productOutputBuilder from "@/products/infrastructure/testing/productOutputBuilder";
import { randomUUID } from "node:crypto";
import type { ProductOutput } from "@/products/application/dto/productIo";
import DeleteProductByIdController from "@/products/infrastructure/http/controllers/DeleteProductByIdController";

let sut: DeleteProductByIdController;
let mockUseCase: MockDeleteProductByIdUseCase;

let req: Partial<Request>;
let res: Partial<Response>;

describe ("DeleteProductByIdController Test.", () => {
    beforeEach (() => {
        mockUseCase = new MockDeleteProductByIdUseCase();
        sut = new DeleteProductByIdController(mockUseCase);
        req = {
            params: {
                id: randomUUID()
            }
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
    });

    it (`should return a response error with code 400 when id is invalid.`, async () => {
        req.params.id = "fake-id";
        await sut.handle(req as Request, res as Response);
        expect (mockUseCase.execute).not.toHaveBeenCalled();
        expect (res.status).toHaveBeenCalledWith(400);
        expect (res.json).toHaveBeenCalledWith({ message: expect.stringContaining("") });
    });

    [
        { useCaseError: new InternalError("Example"), statusCode: 500, occasion: "usecase throws an unexpected error" },
        { useCaseError: new NotFoundError("Example"), statusCode: 404, occasion: "product is not found by id" },
    ].forEach(({ useCaseError, statusCode, occasion }) => {
        it (`should return a response error with code ${statusCode} when ${occasion}.`, async () => {
            mockUseCase.execute.mockRejectedValue(useCaseError);
            await sut.handle(req as Request, res as Response);
            expect (mockUseCase.execute).toHaveBeenCalledWith(req.params.id);
            expect (res.status).toHaveBeenCalledWith(statusCode);
            expect (res.json).toHaveBeenCalledWith({ message: expect.stringContaining("") });
        });
    });

    it (`should return a response product json object with code 200 when product is deleted by id.`, async () => {
        const useCaseOutput: ProductOutput = productOutputBuilder({ id: req.params.id });
        mockUseCase.execute.mockResolvedValue(useCaseOutput);
        await sut.handle(req as Request, res as Response);
        expect (mockUseCase.execute).toHaveBeenCalledWith(req.params.id);
        expect (res.status).toHaveBeenCalledWith(200);
        expect (res.json).toHaveBeenCalledWith({
            message: expect.stringContaining(""), data: useCaseOutput
        });
    });
});