import AuthorizationMiddleware from "@/users/infrastructure/http/middlewares/AuthorizationMiddleware";
import { MockAuthenticationProvider } from "test/users/providers.mock";
import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "@/common/domain/errors/httpErrors";
import TestingMiscGenerator from "test/users/testingHelpers/authGenerators/TestingMiscGenerator";
import { randomUUID } from "crypto";

let res: Response;
let next: NextFunction;

let req: Partial<Request>;

let sut: AuthorizationMiddleware;
let mockAuthProvider: MockAuthenticationProvider;

let token: string;

describe ("AuthorizationMiddleware Test.", () => {
    beforeEach (() => {
        req = {
            headers: {
                authorization: undefined
            },
            authUserId: undefined
        };

        next = vi.fn();

        mockAuthProvider = new MockAuthenticationProvider();
        sut = new AuthorizationMiddleware(mockAuthProvider);
    });

    it ("should throw an UnauthorizedError when request token is empty or invalid", () => {
        req.headers.authorization = undefined;

        expect (() => sut.handle(req as Request, res, next)).toThrow(UnauthorizedError);

        expect (mockAuthProvider.verifyToken).not.toHaveBeenCalled();
        expect (next).not.toHaveBeenCalled();
    });

    it ("should throw an UnauthorizedError when request token is expired", () => {
        token = TestingMiscGenerator.jwt();

        req.headers.authorization = `Bearer ${token}`;

        mockAuthProvider.verifyToken
            .mockImplementation(() => { throw new UnauthorizedError("Example"); });

        expect (() => sut.handle(req as Request, res, next)).toThrow(UnauthorizedError);

        expect (mockAuthProvider.verifyToken).toHaveBeenCalledExactlyOnceWith(token);
        expect (next).not.toHaveBeenCalled();
    });

    it ("should not throw error when request token is valid", () => {
        token = TestingMiscGenerator.jwt();
        
        req.headers.authorization = `Bearer ${token}`;

        const returnedUserId: string = randomUUID();

        mockAuthProvider.verifyToken.mockReturnValue({ userId: returnedUserId });
        
        expect (sut.handle(req as Request, res, next)).toBeUndefined();

        expect (req.authUserId).toBe(returnedUserId);

        expect (mockAuthProvider.verifyToken).toHaveBeenCalledExactlyOnceWith(token);
        expect (next).toHaveBeenCalledOnce();
    });
});