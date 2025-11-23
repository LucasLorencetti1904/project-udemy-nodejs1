import RequestUserPasswordResetController from "@/users/adapters/controllers/RequestUserPasswordResetController";
import { MockResetUserPasswordWithEmailUseCase } from "./UserUseCase.mock";
import type { RequestUserPasswordResetOutput } from "@/users/application/dto/RequestUserPasswordReset";
import type { Request, Response } from "express";
import TestingUserFactory from "test/testingTools/testingFactories/TestingUserFactory";
import { InternalError, NotFoundError } from "@/common/domain/errors/httpErrors";
import { randomUUID } from "node:crypto";

let sut: RequestUserPasswordResetController;
let mockUseCase: MockResetUserPasswordWithEmailUseCase;

let req: Partial<Request>;
let res: Partial<Response>;

describe ("ResetUserPasswordWithEmailController Test.", () => {
    beforeEach (() => {
        mockUseCase = new MockResetUserPasswordWithEmailUseCase();
        sut = new RequestUserPasswordResetController(mockUseCase);

        req = {
            body: undefined
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
    });

    ["invalidEmail", "invalid email @gmail.com", "invalidemailgmail.com", "invalidemail@.com"].forEach((email) => {
        it (`should return a response error with code 400 when user email is invalid.`, async () => {
            req.body = { email };

            await sut.handle(req as Request, res as Response);

            expect (mockUseCase.execute).not.toHaveBeenCalled();
            expect (res.status).toHaveBeenCalledExactlyOnceWith(400);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });

    it ("should return a response error with code 400 when user contains invalid fields.", async () => {
        req.body = { email: "example@gmail.com", unexpectedField: "Unexpected Value" };

        await sut.handle(req as Request, res as Response);

        expect (mockUseCase.execute).not.toHaveBeenCalled();
        expect (res.status).toHaveBeenCalledExactlyOnceWith(400);
        expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
    });

    [
        { useCaseError: new InternalError("Example"), statusCode: 500, occasion: "usecase throws an unexpected error" },
        { useCaseError: new NotFoundError("Example"), statusCode: 404, occasion: "user is not found by email" }
    ].forEach(({ useCaseError, statusCode, occasion }) => {
        it (`should return a response error with code ${statusCode} when ${occasion}.`, async () => {
            req.body = { email: "example@gmail.com" };
            mockUseCase.execute.mockRejectedValue(useCaseError);

            await sut.handle(req as Request, res as Response);

            expect (mockUseCase.execute).toHaveBeenCalledExactlyOnceWith(req.body);
            expect (res.status).toHaveBeenCalledExactlyOnceWith(statusCode);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });


    ["emailexample@gmail.com", "exampleofemail@hotmail.com"].forEach((email) => {
        it (`should return a response user and token json object with code 201 when token is generated successful.`, async () => {
            req.body = { email };
            const useCaseOutput: RequestUserPasswordResetOutput = {
                user: TestingUserFactory.model({ email }),
                token: randomUUID()
            };
            mockUseCase.execute.mockResolvedValue(useCaseOutput);

            await sut.handle(req as Request, res as Response);

            expect (mockUseCase.execute).toHaveBeenCalledExactlyOnceWith(req.body);
            expect (res.status).toHaveBeenCalledExactlyOnceWith(201);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({
                message: expect.stringContaining(""), data: useCaseOutput
            });
        });
    });
});