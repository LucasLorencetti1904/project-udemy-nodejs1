import { MockAuthenticateUserUseCase, MockResetUserPasswordUseCase } from "./UserUseCase.mock";
import type { Request, Response } from "express";
import TestingUserFactory from "test/testingTools/testingFactories/TestingUserFactory";
import { randomUUID } from "node:crypto";
import { BadRequestError, InternalError, NotFoundError } from "@/common/domain/errors/httpErrors";

let sut: ResetUserPasswordController;
let mockUseCase: MockAuthenticateUserUseCase;

let req: Partial<Request>;
let res: Partial<Response>;

describe ("ResetUserPasswordController Test.", () => {
    beforeEach (() => {
        mockUseCase = new MockResetUserPasswordUseCase();
        sut = new ResetUserPasswordController(mockUseCase);

        req = {
            body: undefined
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
    });
    
    [
        {
            newPassword: "",
            token: ""
        },
        {
            newPassword: undefined,
            token: undefined
        },
        {
            newPassword: 11,
            token: true
        },
    ]
    .forEach((invalidReq) => {
        it (`should return a response error with code 400 when user id is empty or invalid.`, async () => {
            req.body = invalidReq;

            await sut.handle(req as Request, res as Response);

            expect (mockUseCase.execute).not.toHaveBeenCalled();
            expect (res.status).toHaveBeenCalledExactlyOnceWith(400);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });

    [
        { useCaseError: new InternalError("Example"), occasion: "usecase throws an unexpected error" },
        { useCaseError: new NotFoundError("Example"), occasion: "password reset token is not found" },
        { useCaseError: new BadRequestError("Example"), occasion: "password reset token is expired" },
        { useCaseError: new NotFoundError("Example"), occasion: "user is not found by id" }
    ].forEach(({ useCaseError, occasion }) => {
        it (`should return a response error with code ${useCaseError.statusCode} when ${occasion}.`, async () => {
            req.body = {
                newPassword: TestingUserFactory.model({}).password,
                token: randomUUID()
            };

            mockUseCase.execute.mockRejectedValue(useCaseError);

            await sut.handle(req as Request, res as Response);

            expect (mockUseCase.execute).toHaveBeenCalledExactlyOnceWith(req.body);
            expect (res.status).toHaveBeenCalledExactlyOnceWith(useCaseError.statusCode);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });

    it (`should return a response message with code 204 when user password updated successfully.`, async () => {
        req.body = {
            newPassword: TestingUserFactory.model({}).password,
            token: randomUUID()
        };

        await sut.handle(req as Request, res as Response);

        expect (mockUseCase.execute).toHaveBeenCalledExactlyOnceWith(req.body);
        expect (res.status).toHaveBeenCalledExactlyOnceWith(200);
        expect (res.json).toHaveBeenCalledExactlyOnceWith({
            message: expect.stringContaining("")
        });
    });
});