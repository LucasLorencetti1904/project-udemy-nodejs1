import { MockSearchProductUseCase } from "./ProductUseCase.mock";
import { Request, Response } from "express";
import { InternalError, NotFoundError } from "@/common/domain/errors/httpErrors";
import productOutputBuilder from "@/products/infrastructure/testing/productOutputBuilder";
import { randomUUID } from "node:crypto";
import GetProductByIdController from "@/products/infrastructure/http/controllers/GetProductByIdController";
import type ProductOutput from "@/products/application/usecases/default/ProductOutput";
import { SearchProductOutput } from "@/products/application/usecases/searchProduct/SearchProdutIo";

let sut: GetProductByIdController;
let mockUseCase: MockSearchProductUseCase;

let req: Partial<Request>;
let res: Partial<Response>;

describe ("SearchProductController Test.", () => {
    beforeEach (() => {
        mockUseCase = new MockSearchProductUseCase();
        sut = new SearchProductController(mockUseCase);
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

    it (`should return a response error with code 500 when usecase throws an unexpected error.`, async () => {
        mockUseCase.execute.mockRejectedValue(new InternalError("Example"));
        await sut.handle(req as Request, res as Response);
        expect (mockUseCase.execute).toHaveBeenCalledExactlyOnceWith(500);
        expect (res.status).toHaveBeenCalledWith(500);
        expect (res.json).toHaveBeenCalledWith({ message: expect.stringContaining("") });
    });

    it (`should return a response search output json object with code 200 when search is successful.`, async () => {
        const useCaseSearchOutput: SearchProductOutput = {
            currentPage: 1,
            perPage: 15,
            lastPage: 3,
            total: 45,
            items: Array(15).fill(productOutputBuilder({}))
        };
        mockUseCase.execute.mockResolvedValue(useCaseSearchOutput);
        await sut.handle(req as Request, res as Response);
        expect (mockUseCase.execute).toHaveBeenCalledWith({});
        expect (res.status).toHaveBeenCalledWith(200);
        expect (res.json).toHaveBeenCalledWith({
            message: expect.stringContaining(""), data: useCaseSearchOutput
        });
    });
});