import UpdateUserAvatarController from "@/users/adapters/controllers/UpdateUserAvatarController";
import { MockAuthenticateUserUseCase } from "./UserUseCase.mock";
import type UpdateUserAvatarInput from "@/users/application/dto/UpdateUserAvatarInput";
import type { UserOutput } from "@/users/application/dto/userIo";
import TestingUserFactory from "test/testingTools/testingFactories/TestingUserFactory";
import type { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { BadRequestError, InternalError, NotFoundError } from "@/common/domain/errors/httpErrors";
import TestingMiscGenerator from "test/testingTools/testingFactories/TestingMiscGenerator";

let sut: UpdateUserAvatarController;
let mockUseCase: MockAuthenticateUserUseCase;

let req: Partial<Omit<Request, "file"> & { file: Partial<Express.Multer.File> }>;
let res: Partial<Response>;

let expectedUseCaseInput: UpdateUserAvatarInput;

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

    Object.entries({
        originalname: Buffer,
        mimetype: 12,
        size: "",
        buffer: true
    }).forEach(([ field, invalidValue]) => {
        it (`should return a response error with code 400 when avatar file ${field} is invalid.`, async () => {
            req.file = { [field]: invalidValue };
    
            await sut.handle(req as Request, res as Response);
    
            expect (mockUseCase.execute).not.toHaveBeenCalled();
            expect (res.status).toHaveBeenCalledExactlyOnceWith(400);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });

    [
        { useCaseError: new InternalError("Example"), occasion: "usecase throws an unexpected error" },
        { useCaseError: new BadRequestError("Example"), occasion: "user avatar file is invalid" },
        { useCaseError: new NotFoundError("Example"), occasion: "user is not found by id" }
    ].forEach(({ useCaseError, occasion }) => {
        it (`should return a response error with code ${useCaseError.statusCode} when ${occasion}.`, async () => {
            req.file = TestingMiscGenerator.partialMulterFile({});
            req.params.id = randomUUID();

            mockUseCase.execute.mockRejectedValue(useCaseError);

            await sut.handle(req as Request, res as Response);

            expectedUseCaseInput = {
                id: req.params.id,
                avatarImage: {
                    name: req.file.originalname,
                    type: req.file.mimetype,
                    size: req.file.size,
                    content: req.file.buffer
                }
            }

            expect (mockUseCase.execute).toHaveBeenCalledExactlyOnceWith(expectedUseCaseInput);
            expect (res.status).toHaveBeenCalledExactlyOnceWith(useCaseError.statusCode);
            expect (res.json).toHaveBeenCalledExactlyOnceWith({ message: expect.stringContaining("") });
        });
    });

    it (`should return a response user json object with code 200 when user avatar updated successfully.`, async () => {
        req.file = TestingMiscGenerator.partialMulterFile({});
        req.params.id = randomUUID();

        const useCaseOutput: UserOutput = TestingUserFactory.output({});
        mockUseCase.execute.mockResolvedValue(useCaseOutput);

        await sut.handle(req as Request, res as Response);

        expectedUseCaseInput = {
            id: req.params.id,
            avatarImage: {
                name: req.file.originalname,
                type: req.file.mimetype,
                size: req.file.size,
                content: req.file.buffer
            }
        }

        expect (mockUseCase.execute).toHaveBeenCalledExactlyOnceWith(expectedUseCaseInput);
        expect (res.status).toHaveBeenCalledExactlyOnceWith(200);
        expect (res.json).toHaveBeenCalledExactlyOnceWith({
            message: expect.stringContaining(""), data: useCaseOutput
        });
    });
});