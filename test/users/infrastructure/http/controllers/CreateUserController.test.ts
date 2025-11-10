import CreateUserController from "@/users/infrastructure/http/controllers/CreateUserController";
import { MockCreateUserUseCase } from "./UserUseCase.mock";
import type { UserOutput } from "@/users/application/dto/userIo";
import TestingUserFactory from "test/users/testingHelpers/TestingUserFactory";
import type { Request, Response } from "express";
import { ConflictError, InternalError } from "@/common/domain/errors/httpErrors";

let sut: CreateUserController;
let mockUseCase: MockCreateUserUseCase;

let req: Partial<Request>;
let res: Partial<Response>;

describe ("CreateUserController Test.", () => {
    beforeEach (() => {
        mockUseCase = new MockCreateUserUseCase();
        sut = new CreateUserController(mockUseCase);

        req = {
            body: undefined
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
    });
    
    ["name", "email", "password"].forEach((field) => {
        it (`should return a response error with code 400 when user ${field} is empty.`, async () => {
            req.body = TestingUserFactory.createInput({ [field]: "" });

            await sut.handle(req as Request, res as Response);

            expect (mockUseCase.execute).not.toHaveBeenCalled();
            expect (res.status).toHaveBeenCalledExactlyOnceWith(400);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });

    ["invalidEmail", "invalid email @gmail.com", "invalidemailgmail.com", "invalidemail@.com"].forEach((value) => {
        it (`should return a response error with code 400 when user email is invalid.`, async () => {
            req.body = TestingUserFactory.createInput({ email: value });

            await sut.handle(req as Request, res as Response);

            expect (mockUseCase.execute).not.toHaveBeenCalled();
            expect (res.status).toHaveBeenCalledExactlyOnceWith(400);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });

    it ("should return a response error with code 400 when user contains invalid fields.", async () => {
        req.body = { ...TestingUserFactory.createInput({}), unexpectedField: "Unexpected Value" };

        await sut.handle(req as Request, res as Response);

        expect (mockUseCase.execute).not.toHaveBeenCalled();
        expect (res.status).toHaveBeenCalledExactlyOnceWith(400);
        expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
    });

    [
        { useCaseError: new InternalError("Example"), statusCode: 500, occasion: "usecase throws an unexpected error" },
        { useCaseError: new ConflictError("Example"), statusCode: 409, occasion: "user email already exists" }
    ].forEach(({ useCaseError, statusCode, occasion }) => {
        it (`should return a response error with code ${statusCode} when ${occasion}.`, async () => {
            req.body = TestingUserFactory.createInput({});
            mockUseCase.execute.mockRejectedValue(useCaseError);

            await sut.handle(req as Request, res as Response);

            expect (mockUseCase.execute).toHaveBeenCalledExactlyOnceWith(req.body);
            expect (res.status).toHaveBeenCalledExactlyOnceWith(statusCode);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });


    [
        { name: "Name Example" }, { name: "Example of random name" },
        { email: "emailexample@gmail.com" }, { email: "exampleofemail@hotmail.com" },
        { password: "123456789a" }, { password: "UserPasswordExample123!*" }
    ]
    .forEach((specificInput) => {
        it (`should return a response user (without password) json object with code 201 when user registered successfully.`, async () => {
            req.body = TestingUserFactory.createInput({ ...specificInput });
            const useCaseOutput: UserOutput = TestingUserFactory.output({ ...req.body });
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