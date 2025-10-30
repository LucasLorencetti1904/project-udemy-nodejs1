import { MockGetProductByIdUseCase } from "./ProductUseCase.mock";
import { Request, Response } from "express";
import { NotFoundError } from "@/common/domain/errors/httpErrors";
import productDataBuilder from "@/products/infrastructure/testing/productDataBuilder";
import { randomUUID } from "node:crypto";
import GetProductByIdController from "@/products/infrastructure/http/controllers/GetProductByIdController";
import type ProductOutput from "@/products/application/usecases/default/ProductOutput";

let sut: GetProductByIdController;
let mockUseCase: MockGetProductByIdUseCase;

let req: Partial<Request>;
let res: Partial<Response>;

describe ("CreateProductController Test.", () => {
    beforeEach (() => {
        mockUseCase = new MockGetProductByIdUseCase();
        sut = new GetProductByIdController(mockUseCase);
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

    it (`should return a response error with code 404 when product is not found by id.`, async () => {
        mockUseCase.execute.mockRejectedValue(new NotFoundError("Example"));
        await sut.handle(req as Request, res as Response);
        expect (mockUseCase.execute).toHaveBeenCalledWith(req.params.id);
        expect (res.status).toHaveBeenCalledWith(404);
        expect (res.json).toHaveBeenCalledWith({ message: expect.stringContaining("") });
    });

    it (`should return a response product json object with code 200 when product is found by id.`, async () => {
        const useCaseOutput: ProductOutput = productDataBuilder({ id: req.params.id });
        mockUseCase.execute.mockResolvedValue(useCaseOutput);
        await sut.handle(req as Request, res as Response);
        expect (mockUseCase.execute).toHaveBeenCalledWith(req.params.id);
        expect (res.status).toHaveBeenCalledWith(200);
        expect (res.json).toHaveBeenCalledWith({
            message: expect.stringContaining(""), data: useCaseOutput
        });
    });
});