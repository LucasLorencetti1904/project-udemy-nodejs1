import SearchUserController from "@/users/adapters/controllers/SearchUserController";
import { MockSearchUserUseCase } from "./UserUseCase.mock";
import type  { SearchUserInput, SearchUserOutput } from "@/users/application/dto/searchUserIo";
import type SearchUserRequest from "@/users/adapters/dto/SearchUserRequest";
import type { Request, Response } from "express";
import TestingUserFactory from "test/testingTools/testingFactories/TestingUserFactory";
import { InternalError } from "@/common/domain/errors/httpErrors";

let sut: SearchUserController;
let mockUseCase: MockSearchUserUseCase;

let req: Partial<Request>;
let res: Partial<Response>;

describe ("SearchUserController Test.", () => {
    beforeEach (() => {
        mockUseCase = new MockSearchUserUseCase();
        sut = new SearchUserController(mockUseCase);

        req = {
            query: {},
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
    });

    const invalidSearchInput: SearchUserRequest & Record<"unexpectedField", any> = {
        pageNumber: "page" as any,
        itemsPerPage: new Map() as any,
        sortField: true as any,
        sortDirection: 12 as any,
        filterField: -579 as any,
        filterValue: false as any,
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
        request: Partial<Record<keyof SearchUserRequest, string>>,
        expectedCall: SearchUserInput,
        output: SearchUserOutput
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
                items: Array(15).fill(TestingUserFactory.output({}))
            }
        },
        {
            request: {
                pageNumber: "3",
                itemsPerPage: "12",
                sortField: "name",
                sortDirection: "asc",
                filterField: "name",
                filterValue: "example"
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
                items: Array(12).fill(TestingUserFactory.output({}))
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