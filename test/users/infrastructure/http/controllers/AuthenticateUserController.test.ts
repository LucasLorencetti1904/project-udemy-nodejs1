import AuthenticateUserController from "@/users/infrastructure/http/controllers/AuthenticateUserController";
import { MockAuthenticateUserUseCase } from "./UserUseCase.mock";
import TestingUserFactory from "test/users/testingHelpers/TestingUserFactory";
import type { AuthenticateUserOutput } from "@/users/application/dto/authenticateUserIo";
import type { Request, Response } from "express";
import { BadRequestError, ConflictError, InternalError } from "@/common/domain/errors/httpErrors";

let sut: AuthenticateUserController;
let mockUseCase: MockAuthenticateUserUseCase;

let req: Partial<Request>;
let res: Partial<Response>;

describe ("CreateUserController Test.", () => {
    beforeEach (() => {
        mockUseCase = new MockAuthenticateUserUseCase();
        sut = new AuthenticateUserController(mockUseCase);

        req = {
            body: undefined
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
    });
    
    ["email", "password"].forEach((field) => {
        it (`should return a response error with code 400 when user ${field} is empty.`, async () => {
            req.body = TestingUserFactory.authenticateInput({ [field]: "" });

            await sut.handle(req as Request, res as Response);

            expect (mockUseCase.execute).not.toHaveBeenCalled();
            expect (res.status).toHaveBeenCalledExactlyOnceWith(400);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });

    ["invalidEmail", "invalid email @gmail.com", "invalidemailgmail.com", "invalidemail@.com"].forEach((value) => {
        it (`should return a response error with code 400 when user email is invalid.`, async () => {
            req.body = TestingUserFactory.authenticateInput({ email: value });

            await sut.handle(req as Request, res as Response);

            expect (mockUseCase.execute).not.toHaveBeenCalled();
            expect (res.status).toHaveBeenCalledExactlyOnceWith(400);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });

    it ("should return a response error with code 400 when user credentials contains invalid fields.", async () => {
        req.body = { ...TestingUserFactory.authenticateInput({}), unexpectedField: "Unexpected Value" };

        await sut.handle(req as Request, res as Response);

        expect (mockUseCase.execute).not.toHaveBeenCalled();
        expect (res.status).toHaveBeenCalledExactlyOnceWith(400);
        expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
    });

    [
        { useCaseError: new InternalError("Example"), statusCode: 500, occasion: "usecase throws an unexpected error" },
        { useCaseError: new ConflictError("Example"), statusCode: 409, occasion: "user email already exists" },
        { useCaseError: new BadRequestError("Example"), statusCode: 400, occasion: "user password does not match" }
    ].forEach(({ useCaseError, statusCode, occasion }) => {
        it (`should return a response error with code ${statusCode} when ${occasion}.`, async () => {
            req.body = TestingUserFactory.authenticateInput({});
            mockUseCase.execute.mockRejectedValue(useCaseError);

            await sut.handle(req as Request, res as Response);

            expect (mockUseCase.execute).toHaveBeenCalledExactlyOnceWith(req.body);
            expect (res.status).toHaveBeenCalledExactlyOnceWith(statusCode);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });


    [
        { email: "emailexample@gmail.com" }, { email: "exampleofemail@hotmail.com" },
        { password: "123456789a" }, { password: "UserPasswordExample123!*" }
    ]
    .forEach((specificInput) => {
        it (`should return a response user (without password) json object with code 201 when user registered successfully.`, async () => {
            req.body = TestingUserFactory.authenticateInput({ ...specificInput });
            const useCaseOutput: AuthenticateUserOutput = {
                token: "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.dBj5W9i5jzA"
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