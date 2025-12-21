import SearchProductController from "@/products/adapters/controllers/SearchProductController";
import { MockSearchProductUseCase } from "./ProductUseCase.mock";
import type { SearchProductInput, SearchProductOutput } from "@/products/application/dto/searchProductIo";
import type SearchProductRequest from "@/products/adapters/dto/SearchProductRequest";
import TestingProductFactory from "test/testingTools/testingFactories/TestingProductFactory";
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

    const invalidSearchInput: SearchProductRequest & Record<"unexpectedField", any> = {
        pagenumber: "page" as any,
        itemsperpage: new Map() as any,
        sortfield: true as any,
        sortdirection: 12 as any,
        filterfield: -579 as any,
        filtervalue: false as any,
        unexpectedField: "Unexpected Value"
    };

    for (let field in invalidSearchInput) {
        it (`should return a response error with code 400 when search request '${field}' is invalid.`, async () => {
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
        request: Partial<Record<keyof SearchProductRequest, string>>,
        expectedCall: SearchProductInput,
        output: SearchProductOutput
    };

    const cases: Case[] = [
        {
            request: {},
            expectedCall: {},
            output: {  
                pagination: {
                    currentPage: 1,
                    itemsPerPage: 15,
                    lastPage: 2,
                },
                total: 28,
                items: Array(15).fill(TestingProductFactory.output({}))
            }
        },
        {
            request: {
                pagenumber: "3",
                itemsperpage: "12",
                sortfield: "name",
                sortdirection: "asc",
                filterfield: "name",
                filtervalue: "example"
            },
            expectedCall: {
                pagination: {
                    pageNumber: 3,
                    itemsPerPage: 12,
                },
                sorting: {
                    field: "name",
                    direction: "asc"
                },
                filter: {
                    field: "name",
                    value: "example"
                }
            },
            output: {   
                pagination: {
                    currentPage: 3,
                    itemsPerPage: 12,
                    lastPage: 4
                },
                total: 45,
                items: Array(12).fill(TestingProductFactory.output({}))
            }
        }
    ];

    cases.forEach(({ request, output, expectedCall }) => {
        it (`should return a response search output json object with code 200 when search is successful.`, async () => {
            mockUseCase.execute.mockResolvedValue(output);
            req.query = request;

            await sut.handle(req as Request, res as Response);
            
            expect (mockUseCase.execute).toHaveBeenCalledWith(expectedCall);
            expect (res.status).toHaveBeenCalledWith(200);
            expect (res.json).toHaveBeenCalledWith({
                message: expect.stringContaining(""), data: output
            });
        });
    });
});