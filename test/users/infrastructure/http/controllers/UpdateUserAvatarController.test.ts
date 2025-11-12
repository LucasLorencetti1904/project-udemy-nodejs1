import UpdateUserAvatarController from "@/users/infrastructure/http/controllers/UpdateUserAvatarController";
import { MockAuthenticateUserUseCase } from "./UserUseCase.mock";
import type { UserOutput } from "@/users/application/dto/userIo";
import TestingUserFactory from "test/users/testingHelpers/TestingUserFactory";
import type { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { BadRequestError, InternalError, NotFoundError } from "@/common/domain/errors/httpErrors";

let sut: UpdateUserAvatarController;
let mockUseCase: MockAuthenticateUserUseCase;

let req: Partial<{file: any} & Request>;
let res: Partial<Response>;

describe ("UpdateUserAvatarController Test.", () => {
    beforeEach (() => {
        mockUseCase = new MockAuthenticateUserUseCase();
        sut = new UpdateUserAvatarController(mockUseCase);

        req = {
            params: {
                id: undefined
            },
            file: undefined
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
    });
    
    ["", "invalid-id"].forEach((idInput) => {
        it (`should return a response error with code 400 when user id is empty or invalid.`, async () => {
            req.params.id = idInput;

            await sut.handle(req as Request, res as Response);

            expect (mockUseCase.execute).not.toHaveBeenCalled();
            expect (res.status).toHaveBeenCalledExactlyOnceWith(400);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });

    it (`should return a response error with code 400 when avatar file is undefined.`, async () => {
        req.file = undefined;

        await sut.handle(req as Request, res as Response);

        expect (mockUseCase.execute).not.toHaveBeenCalled();
        expect (res.status).toHaveBeenCalledExactlyOnceWith(400);
        expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
    });

    [
        { useCaseError: new InternalError("Example"), occasion: "usecase throws an unexpected error" },
        { useCaseError: new BadRequestError("Example"), occasion: "user avatar file does is invalid" },
        { useCaseError: new NotFoundError("Example"), occasion: "user is not found by id" }
    ].forEach(({ useCaseError, occasion }) => {
        it (`should return a response error with code ${useCaseError.statusCode} when ${occasion}.`, async () => {
            req.file = TestingUserFactory.avatarImage({});
            req.params.id = randomUUID();

            mockUseCase.execute.mockRejectedValue(useCaseError);

            await sut.handle(req as Request, res as Response);

            expect (mockUseCase.execute).toHaveBeenCalledExactlyOnceWith({ ...req.file, ...req.body });
            expect (res.status).toHaveBeenCalledExactlyOnceWith(useCaseError.statusCode);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });

    it (`should return a response user json object with code 200 when user avatar updated successfully.`, async () => {
        req.file = TestingUserFactory.avatarImage({});
        req.params.id = randomUUID();

        const useCaseOutput: UserOutput = TestingUserFactory.output({});
        mockUseCase.execute.mockResolvedValue(useCaseOutput);

        await sut.handle(req as Request, res as Response);

        expect (mockUseCase.execute).toHaveBeenCalledExactlyOnceWith(req.body);
        expect (res.status).toHaveBeenCalledExactlyOnceWith(201);
        expect (res.json).toHaveBeenCalledExactlyOnceWith({
            message: expect.stringContaining(""), data: useCaseOutput
        });
    });
});