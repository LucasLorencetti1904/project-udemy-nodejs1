import type { NextFunction, Request, Response } from "express";
import type AuthenticationProvider from "@/common/domain/providers/AuthenticationProvider";
import { inject, injectable } from "tsyringe";
import { UnauthorizedError } from "@/common/domain/errors/httpErrors";

@injectable()
export default class AuthorizationMiddleware {
    constructor(
        @inject("AuthenticationProvider")
        private readonly authProvider: AuthenticationProvider
    ) {}

    public handle = (req: Request, _res: Response, next: NextFunction): void => {
        try {
            const authHeader: string = req.headers.authorization;
        
            if (!authHeader) {
                throw new UnauthorizedError("Token is missing.");
            }
        
            const [, token] = authHeader.split(" ");    
        
            const { userId } = this.authProvider.verifyToken(token);
        
            req.authUserId = userId;
        
            return next();
        }

        catch (e: unknown) {
            throw e;
        }
    };
}