import SearchProductController from "@/products/adapters/controllers/SearchProductController";
import { MockSearchProductUseCase } from "./ProductUseCase.mock";
import { SearchProductInput, SearchProductOutput } from "@/products/application/dto/searchProdutIo";
import TestingProductFactory from "test/products/testingHelpers/TestingProductFactory";
import { Request, Response } from "express";
import { InternalError } from "@/common/domain/errors/httpErrors";

let sut: SearchProductController;
let mockUseCase: MockSearchProductUseCase;

let req: Partial<Request>;
let res: Partial<Response>;

describe ("SearchProductController Test.", () => {
    beforeEach (() => {
        mockUseCase = new MockSearchProductUseCase();
        sut = new SearchProductController(mockUseCase);

        req = {
            query: {},
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
    });

    const invalidSearchInput: SearchProductInput & Record<"unexpectedField", any> = {
        page: "page" as any,
        perPage: new Map() as any,
        sort: 12 as any,
        sortDir: true as any,
        filter: -579 as any,
        unexpectedField: "Unexpected Value"
    };

    for (let field in invalidSearchInput) {
        it (`should return a response error with code 400 when search input is invalid.`, async () => {
            req.query = { [field]: invalidSearchInput[field] };

            await sut.handle(req as Request, res as Response);

            expect (mockUseCase.execute).not.toHaveBeenCalled();
            expect (res.status).toHaveBeenCalledWith(400);
            expect (res.json).toHaveBeenCalledWith({ message: expect.stringContaining("") });
        });
    }

    it (`should return a response error with code 500 when usecase throws an unexpected error.`, async () => {
        mockUseCase.execute.mockRejectedValue(new InternalError("Example"));
        req.query = {};

        await sut.handle(req as Request, res as Response);

        expect (mockUseCase.execute).toHaveBeenCalledExactlyOnceWith({});
        expect (res.status).toHaveBeenCalledWith(500);
        expect (res.json).toHaveBeenCalledWith({ message: expect.stringContaining("") });
    });

    type Case = {
        input: Partial<Record<keyof SearchProductInput, string>>,
        output: SearchProductOutput
        expectedCall: SearchProductInput 
    };

    const cases: Case[] = [
        {
            input: {},
            output: {     
                currentPage: 1,
                perPage: 15,
                lastPage: 2,
                total: 28,
                items: Array(15).fill(TestingProductFactory.output({}))
            },
            expectedCall: {}
        },
        {
            input: {
                page: "3",
                perPage: "12",
                sort: "name",
                sortDir: "asc",
                filter: "example"
            },
            output: {     
                currentPage: 3,
                perPage: 12,
                lastPage: 4,
                total: 45,
                items: Array(12).fill(TestingProductFactory.output({}))
            },
            expectedCall: {
                page: 3,
                perPage: 12,
                sort: "name",
                sortDir: "asc",
                filter: "example"
            }
        }
    ];

    cases.forEach(({ input, output, expectedCall }) => {
        it (`should return a response search output json object with code 200 when search is successful.`, async () => {
            mockUseCase.execute.mockResolvedValue(output);
            req.query = input;
            
            await sut.handle(req as Request, res as Response);

            expect (mockUseCase.execute).toHaveBeenCalledWith(expectedCall);
            expect (res.status).toHaveBeenCalledWith(200);
            expect (res.json).toHaveBeenCalledWith({
                message: expect.stringContaining(""), data: output
            });
        });
    });
});