import { MockSearchProductUseCase } from "./ProductUseCase.mock";
import { Request, Response } from "express";
import { InternalError } from "@/common/domain/errors/httpErrors";
import productOutputBuilder from "@/products/infrastructure/testing/productOutputBuilder";
import { randomUUID } from "node:crypto";
import { SearchProductInput, SearchProductOutput } from "@/products/application/usecases/searchProduct/SearchProdutIo";
import SearchProductController from "@/products/infrastructure/http/controllers/SearchProductController";

let sut: SearchProductController;
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

    const invalidSearchInput: SearchProductInput = {
        page: "page" as any,
        perPage: false as any,
        sort: 12 as any,
        sortDir: true as any,
        filter: -579 as any
    };

    for (let field in invalidSearchInput) {
        it (`should return a response error with code 400 when search input is invalid.`, async () => {
            req.body = { [field]: invalidSearchInput[field] };
            await sut.handle(req as Request, res as Response);
            expect (mockUseCase.execute).not.toHaveBeenCalled();
            expect (res.status).toHaveBeenCalledWith(400);
            expect (res.json).toHaveBeenCalledWith({ message: expect.stringContaining("") });
        });
    }

    it (`should return a response error with code 500 when usecase throws an unexpected error.`, async () => {
        mockUseCase.execute.mockRejectedValue(new InternalError("Example"));
        req.body = {};
        await sut.handle(req as Request, res as Response);
        expect (mockUseCase.execute).toHaveBeenCalledExactlyOnceWith({});
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
        req.body = {};
        await sut.handle(req as Request, res as Response);
        expect (mockUseCase.execute).toHaveBeenCalledWith({});
        expect (res.status).toHaveBeenCalledWith(200);
        expect (res.json).toHaveBeenCalledWith({
            message: expect.stringContaining(""), data: useCaseSearchOutput
        });
    });
});